<?php
/**
 * Interface Initialize_Site.
 *
 * @package   Google\Web_Stories
 * @copyright 2019 Alain Schlesser
 * @license   MIT
 * @link      https://www.mwpd.io/
 */

/**
 * Original code modified for this project.
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

namespace Google\Web_Stories\Infrastructure;

/**
 * Something that can be activated.
 *
 * By tagging a service with this interface, the system will automatically hook
 * it up to the WordPress activation hook.
 *
 * This way, we can just add the simple interface marker and not worry about how
 * to wire up the code to reach that part during the static activation hook.
 *
 * @since 1.8.0
 * @internal
 */
interface Initialize_Site {

	/**
	 * Initialize the service on new site ( Multisite only )
	 *
	 * @since 1.8.0
	 *
	 * @return void
	 */
	public function initialize_site();
}
