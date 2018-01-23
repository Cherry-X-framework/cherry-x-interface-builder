<?php
/**
 * UI controls manager class
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( ! class_exists( 'CX_Controls_Manager' ) ) {

	/**
	 * Define CX_Controls_Manager class
	 */
	class CX_Controls_Manager {

		/**
		 * Path to controls folder for current Inteface Builder instance
		 *
		 * @var string
		 */
		private $module_path = '';

		/**
		 * Constructor for the class
		 */
		public function __construct( $module_path = null ) {
			$this->module_path = trailingslashit( $module_path );
			require $this->module_path . 'inc/class-cx-controls-base.php';
			$this->load_controls();

		}

		/**
		 * Automatically load found conrols
		 *
		 * @return void
		 */
		public function load_controls() {
			foreach ( glob( $this->module_path . 'inc/controls/*.php' ) as $file ) {
				require $file;
			}
		}

		/**
		 * Register new control instance
		 *
		 * @return object
		 */
		public function register_control( $type = 'text', $args = array() ) {

			$prefix    = 'CX_Control_';
			$classname = $prefix . str_replace( ' ', '_', ucwords( str_replace( '-', ' ', $type ) ) );

			if ( ! $classname ) {
				return false;
			}

			return new $classname( $args );
		}

	}

}
