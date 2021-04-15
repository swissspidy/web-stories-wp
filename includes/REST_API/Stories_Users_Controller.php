<?php
/**
 * Class Stories_Users_Controller
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

namespace Google\Web_Stories\REST_API;

use Google\Web_Stories\Infrastructure\Delayed;
use Google\Web_Stories\Infrastructure\Registerable;
use Google\Web_Stories\Infrastructure\Service;
use Google\Web_Stories\Traits\Register_Routes;
use WP_REST_Users_Controller;

/**
 * Stories_Users_Controller class.
 */
class Stories_Users_Controller extends WP_REST_Users_Controller implements Service, Delayed, Registerable {
	use Register_Routes;
	/**
	 * Constructor.
	 *
	 * Override the namespace.
	 *
	 * @since 1.2.0
	 */
	public function __construct() {
		parent::__construct();
		$this->namespace = 'web-stories/v1';
	}

}
