<?php
/**
 * Class Embed
 *
 * @package   Google\Web_Stories\Renderer\Story
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


namespace Google\Web_Stories\Renderer\Story;

use Google\Web_Stories\Assets;
use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Register_Global_Assets;
use Google\Web_Stories\Traits\Amp;

/**
 * Class Embed
 *
 * @package Google\Web_Stories\Renderer\Story
 */
class Embed {

	use Amp;

	/**
	 * Current post.
	 *
	 * @var Story Post object.
	 */
	protected $story;

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	private $assets;

	/**
	 * Register_Global_Assets instance.
	 *
	 * @var Register_Global_Assets Register_Global_Assets instance.
	 */
	protected $register_global_assets;

	/**
	 * Embed constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Story                  $story   Story Object.
	 * @param Assets                 $assets Assets instance.
	 * @param Register_Global_Assets $register_global_assets Register_Global_Assets instance.
	 */
	public function __construct( Story $story, Assets $assets, Register_Global_Assets $register_global_assets ) {
		$this->assets                 = $assets;
		$this->story                  = $story;
		$this->register_global_assets = $register_global_assets;
	}

	/**
	 * Renders the block output in default context.
	 *
	 * @since 1.0.0
	 *
	 * @param array $args Array of Argument to render.
	 *
	 * @return string Rendered block type output.
	 */
	public function render( array $args = [] ) {
		$defaults = [
			'align'  => 'none',
			'class'  => 'wp-block-web-stories-embed',
			'height' => 600,
			'width'  => 360,
		];

		$args   = wp_parse_args( $args, $defaults );
		$align  = sprintf( 'align%s', $args['align'] );
		$class  = $args['class'];
		$url    = $this->story->get_url();
		$title  = $this->story->get_title();
		$poster = ! empty( $this->story->get_poster_portrait() ) ? esc_url_raw( $this->story->get_poster_portrait() ) : '';

		$poster_style  = ! empty( $poster ) ? sprintf( '--story-player-poster: url(%s)', $poster ) : '';
		$wrapper_style = sprintf(
			'--aspect-ratio: %F; --width: %dpx; --height: %dpx',
			0 !== $args['width'] ? $args['height'] / $args['width'] : 1,
			(int) $args['width'],
			(int) $args['height']
		);

		// This CSS is used for AMP and non-AMP.
		wp_enqueue_style( Embed_Base::SCRIPT_HANDLE );

		if ( $this->is_amp() ) {
			ob_start();
			?>
			<div class="<?php echo esc_attr( "$class web-stories-embed web-stories-embed-amp $align" ); ?>">
				<div class="wp-block-embed__wrapper">
					<amp-story-player
						width="<?php echo esc_attr( $args['width'] ); ?>"
						height="<?php echo esc_attr( $args['height'] ); ?>"
						layout="intrinsic">
						<a
							href="<?php echo esc_url( $url ); ?>"
							style="<?php echo esc_attr( $poster_style ); ?>">
							<?php echo esc_html( $title ); ?>
						</a>
					</amp-story-player>
				</div>
			</div>
			<?php

			return (string) ob_get_clean();
		}

		$this->register_global_assets->register();
		$this->assets->enqueue_style( $this->register_global_assets->get_player_handle() );
		$this->assets->enqueue_script( $this->register_global_assets->get_player_handle() );

		ob_start();
		?>
		<div class="<?php echo esc_attr( "$class web-stories-embed $align" ); ?>">
			<div class="wp-block-embed__wrapper" style="<?php echo esc_attr( $wrapper_style ); ?>">
				<amp-story-player>
					<a
						href="<?php echo esc_url( $url ); ?>"
						style="<?php echo esc_attr( $poster_style ); ?>">
						<?php echo esc_html( $title ); ?>
					</a>
				</amp-story-player>
			</div>
		</div>
		<?php

		return (string) ob_get_clean();
	}
}
