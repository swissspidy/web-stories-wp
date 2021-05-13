<?php
/**
 * Class Jetpack
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

namespace Google\Web_Stories\Integrations;

use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;
use WP_Post;
use WP_REST_Response;

/**
 * Class Jetpack.
 */
class Jetpack extends Service_Base {

	/**
	 * VideoPress Mime type.
	 *
	 * @since 1.8.0
	 *
	 * @var string
	 */
	const MIME_TYPE = 'video/videopress';

	/**
	 * Initializes all hooks.
	 *
	 * @since 1.2.0
	 *
	 * @return void
	 */
	public function register() {
		// See https://github.com/Automattic/jetpack/blob/4b85be883b3c584c64eeb2fb0f3fcc15dabe2d30/modules/custom-post-types/portfolios.php#L80.
		if ( defined( 'IS_WPCOM' ) && IS_WPCOM ) {
			add_filter( 'wpcom_sitemap_post_types', [ $this, 'add_to_jetpack_sitemap' ] );
		} else {
			add_filter( 'jetpack_sitemap_post_types', [ $this, 'add_to_jetpack_sitemap' ] );
		}

		add_filter( 'jetpack_is_amp_request', [ $this, 'force_amp_request' ] );
		add_filter( 'web_stories_allowed_mime_types', [ $this, 'add_videopress' ] );
		add_filter( 'web_stories_rest_prepare_attachment', [ $this, 'filter_api_response' ], 10, 2 );
		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'filter_admin_ajax_response' ], 10, 2 );
	}

	/**
	 * Adds the web story post type to Jetpack / WordPress.com sitemaps.
	 *
	 * @see https://github.com/Automattic/jetpack/blob/4b85be883b3c584c64eeb2fb0f3fcc15dabe2d30/modules/custom-post-types/portfolios.php#L80
	 *
	 * @since 1.2.0
	 *
	 * @param array $post_types Array of post types.
	 *
	 * @return array Modified list of post types.
	 */
	public function add_to_jetpack_sitemap( $post_types ) {
		$post_types[] = Story_Post_Type::POST_TYPE_SLUG;

		return $post_types;
	}

	/**
	 * Add VideoPress to allowed mime types.
	 *
	 * @since 1.8.0
	 *
	 * @param array $mime_types Associative array of allowed mime types per media type (image, audio, video).
	 *
	 * @return array
	 */
	public function add_videopress( array $mime_types ) {
		$mime_types['video'][] = self::MIME_TYPE;

		return $mime_types;
	}

	/**
	 * Filter admin ajax responses to change video/videopress back to mp4.
	 *
	 * @since 1.8.0
	 *
	 * @param array   $response   Array of prepared attachment data. @see wp_prepare_attachment_for_js().
	 * @param WP_Post $attachment Attachment object.
	 *
	 * @return array
	 */
	public function filter_admin_ajax_response( array $response, WP_Post $attachment ) {
		if ( self::MIME_TYPE !== $attachment->post_mime_type ) {
			return $response;
		}

		$post_data = $_POST; // phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( ! isset( $post_data['action'] ) || 'query-attachments' !== $post_data['action'] ) {
			return $response;
		}

		if ( ! isset( $post_data['query'] ) && ! isset( $post_data['query']['source'] ) || 'web_stories_editor' !== $post_data['query']['source'] ) {
			return $response;
		}

		$response['mime'] = 'video/mp4';

		return $response;
	}

	/**
	 * Filter REST API responses to change video/videopress back to mp4.
	 *
	 * @since 1.8.0
	 *
	 * @param WP_REST_Response $response The response object.
	 * @param WP_Post          $post     The original attachment post.
	 *
	 * @return WP_REST_Response
	 */
	public function filter_api_response( WP_REST_Response $response, WP_Post $post ) {
		if ( self::MIME_TYPE !== $post->post_mime_type ) {
			return $response;
		}

		$data = $response->get_data();

		$data['mime_type'] = 'video/mp4';
		$response->set_data( $data );

		return $response;
	}

	/**
	 * Force jetpack to see web stories as AMP.
	 *
	 * @since 1.2.0
	 *
	 * @param boolean $is_amp_request Is the request supposed to return valid AMP content.
	 *
	 * @return bool Whether the current request is an AMP request.
	 */
	public function force_amp_request( $is_amp_request ) {
		if ( ! is_singular( Story_Post_Type::POST_TYPE_SLUG ) ) {
			return $is_amp_request;
		}
		return true;
	}
}
