<?php


namespace Google\Web_Stories\Tests\Admin;

use Google\Web_Stories\Experiments;
use Google\Web_Stories\Tests\Test_Case;

/**
 * @coversDefaultClass \Google\Web_Stories\Admin\Site_Health
 */
class Site_Health extends Test_Case {
	/**
	 * @covers ::register
	 */
	public function test_register() {
		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$site_health = new \Google\Web_Stories\Admin\Site_Health( $experiments );
		$site_health->register();

		$this->assertEquals( 10, has_filter( 'debug_information', [ $site_health, 'add_debug_information' ] ) );
		$this->assertEquals( 10, has_filter( 'site_status_test_php_modules', [ $site_health, 'add_extensions' ] ) );
		$this->assertEquals( 10, has_filter( 'site_status_test_result', [ $site_health, 'modify_test_result' ] ) );
	}

	/**
	 * @covers ::add_debug_information
	 */
	public function test_add_debug_information() {
		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'is_experiment_enabled' )
					->willReturn( true );
		$experiments->method( 'get_experiments' )
					->willReturn(
						[
							[
								'name'        => 'foo',
								'label'       => 'Foo Label',
								'description' => 'Foo Desc',
							],
							[
								'name'        => 'bar',
								'label'       => 'Bar Label',
								'description' => 'Bar Desc',
								'default'     => true,
							],
						]
					);
		$site_health = new \Google\Web_Stories\Admin\Site_Health( $experiments );
		$results     = $site_health->add_debug_information( [] );

		$this->assertArrayHasKey( 'web_stories', $results );
		$this->assertArrayHasKey( 'fields', $results['web_stories'] );
		$this->assertArrayHasKey( 'web_stories_version', $results['web_stories']['fields'] );
		$this->assertArrayHasKey( 'value', $results['web_stories']['fields']['web_stories_version'] );
		$this->assertSame( WEBSTORIES_VERSION, $results['web_stories']['fields']['web_stories_version']['value'] );
		$this->assertArrayHasKey( 'web_stories_enabled_experiments', $results['web_stories']['fields'] );
		$this->assertArrayHasKey( 'value', $results['web_stories']['fields']['web_stories_enabled_experiments'] );
		$this->assertIsArray( $results['web_stories']['fields']['web_stories_enabled_experiments']['value'] );
	}
}
