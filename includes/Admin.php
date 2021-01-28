<?php
/**
 * Admin class.
 *
 * Responsible for WordPress admin integration.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace Google\Web_Stories;

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Story_Renderer\Image;
use WP_Post;
use WP_Screen;


/**
 * Admin class.
 */
class Admin {
	/**
	 * KSES instance.
	 *
	 * @var KSES KSES instance.
	 */
	protected $kses;
	/**
	 * Initialize admin-related functionality.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'admin_body_class', [ $this, 'admin_body_class' ], 99 );
		add_filter( 'default_content', [ $this, 'prefill_post_content' ], 10, 2 );
		add_filter( 'default_title', [ $this, 'prefill_post_title' ] );
		add_action( 'wp_ajax_inline-save', [ $this, 'load_kses_before_inline_save' ], 0 );
		add_action( 'load-edit.php', [ $this, 'admin_header' ], 10 );
		add_action( 'admin_footer-edit.php', [ $this, 'admin_footer' ], 10 );
	}

	/**
	 * Filter the list of admin classes.
	 *
	 * Makes sure the admin menu is collapsed when accessing
	 * the dashboard and the editor.
	 *
	 * @since 1.0.0
	 *
	 * @param string $class Current classes.
	 *
	 * @return string $class List of Classes.
	 */
	public function admin_body_class( $class ) {
		$screen = get_current_screen();

		if ( ! $screen instanceof WP_Screen ) {
			return $class;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $screen->post_type ) {
			return $class;
		}

		// Default WordPress posts list table screen and dashboard.
		if ( 'post' !== $screen->base ) {
			return $class;
		}

		$class .= ' edit-story';

		// Overrides regular WordPress behavior by collapsing the admin menu by default.
		if ( false === strpos( $class, 'folded' ) ) {
			$class .= ' folded';
		}

		return $class;
	}

	/**
	 * Pre-fills post content with a web-story/embed block.
	 *
	 * @since 1.0.0
	 *
	 * @param string   $content Default post content.
	 * @param \WP_Post $post    Post object.
	 *
	 * @return string Pre-filled post content if applicable, or the default content otherwise.
	 */
	public function prefill_post_content( $content, $post ) {
		if ( ! isset( $_GET['from-web-story'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return $content;
		}

		$post_id = absint( sanitize_text_field( (string) wp_unslash( $_GET['from-web-story'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		if ( ! $post_id || Story_Post_Type::POST_TYPE_SLUG !== get_post_type( $post_id ) ) {
			return $content;
		}

		if ( ! current_user_can( 'read_post', $post_id ) ) {
			return $content;
		}

		$story = new Story();
		if ( ! $story->load_from_post( $post_id ) ) {
			return $content;
		}

		$args = [
			'align'  => 'none',
			'height' => 600,
			'width'  => 360,
		];

		if ( ! use_block_editor_for_post( $post ) ) {

			$content = '[web_stories_embed url="%1$s" title="%2$s" poster="%3$s" width="%4$s" height="%5$s" align="%6$s"]';

			return sprintf(
				$content,
				esc_url( $story->get_url() ),
				esc_attr( $story->get_title() ),
				esc_url( $story->get_poster_portrait() ),
				absint( $args['width'] ),
				absint( $args['height'] ),
				esc_attr( $args['align'] )
			);
		}

		$renderer = new Image( $story );
		$html     = $renderer->render( $args );

		$content = '<!-- wp:web-stories/embed {"url":"%1$s","title":"%2$s","poster":"%3$s","width":"%4$s","height":"%5$s","align":"%6$s"} -->%7$s<!-- /wp:web-stories/embed -->';

		return sprintf(
			$content,
			esc_url( $story->get_url() ),
			esc_js( $story->get_title() ),
			esc_url( $story->get_poster_portrait() ),
			absint( $args['width'] ),
			absint( $args['height'] ),
			esc_js( $args['align'] ),
			$html
		);
	}

	/**
	 * Pre-fills post title with the story title.
	 *
	 * @since 1.0.0
	 *
	 * @param string $title Default post title.
	 *
	 * @return string Pre-filled post title if applicable, or the default title otherwise.
	 */
	public function prefill_post_title( $title ) {
		if ( ! isset( $_GET['from-web-story'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return $title;
		}

		$post_id = absint( sanitize_text_field( (string) wp_unslash( $_GET['from-web-story'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		if ( ! $post_id ) {
			return $title;
		}

		if ( ! current_user_can( 'read_post', $post_id ) ) {
			return $title;
		}

		$post = get_post( $post_id );

		if ( ! $post instanceof WP_Post || Story_Post_Type::POST_TYPE_SLUG !== $post->post_type ) {
			return $title;
		}

		// Not using get_the_title() because we need the raw title.
		// Otherwise it runs through wptexturize() and the like, which we want to avoid.
		return isset( $post->post_title ) ? $post->post_title : '';
	}

	/**
	 * Hook in before wp_ajax_inline-save and add KSES.
	 *
	 * @since 1.4.0
	 *
	 * @return void
	 */
	public function load_kses_before_inline_save() {
		if ( ! isset( $_POST['post_type'] ) || Story_Post_Type::POST_TYPE_SLUG !== $_POST['post_type'] ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
			return;
		}
		$this->kses = new KSES();
		$this->kses->init();
	}

	/**
	 * Hook admin header for the all stories screen.
	 *
	 * @since 1.4.0
	 *
	 * @return void
	 */
	public function admin_header() {
		$screen = get_current_screen();

		if ( ! $screen instanceof WP_Screen ) {
			return;
		}

		if ( 'edit' !== $screen->base ) {
			return;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $screen->post_type ) {
			return;
		}

		$this->kses = new KSES();
		$this->kses->init();
	}

	/**
	 * Hook admin footer for the all stories screen.
	 *
	 * @since 1.4.0
	 *
	 * @return void
	 */
	public function admin_footer() {
		$screen = get_current_screen();

		if ( ! $screen instanceof WP_Screen ) {
			return;
		}

		if ( 'edit' !== $screen->base ) {
			return;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $screen->post_type ) {
			return;
		}

		if ( $this->kses instanceof KSES ) {
			$this->kses->remove_filters();
		}
	}
}
