<?php
/**
 * Class Register_Widget.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
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

use Google\Web_Stories\Widgets\Stories;

/**
 * Class RegisterWidget
 */
class Register_Widget extends Service_Base {
	/**
	 * Register Widgets.
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function register() {
		$injector = Services::get_injector();
		if ( ! method_exists( $injector, 'make' ) ) {
			return;
		}
		$story = $injector->make( Stories::class );
		register_widget( $story );
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action() {
		return 'widgets_init';
	}
}
