<?php
/**
 * Control base class
 */

/**
 * CX_Controls_Base abstract class
 */
if ( ! class_exists( 'CX_Controls_Base' ) ) {

	/**
	 * CX_Controls_Base Abstract Class
	 *
	 * @since 1.0.0
	 */
	abstract class CX_Controls_Base {

		/**
		 * Constructor method for the CX_Controls_Base class.
		 *
		 * @since 1.0.0
		 */
		public function __construct( $args = array() ) {
			$this->defaults_settings['id'] = 'cx-control-' . uniqid();
			$this->settings = wp_parse_args( $args, $this->defaults_settings );
			$this->init();
		}

		/**
		 * Render methos. Each UI element must implement own method
		 * @return [type] [description]
		 */
		abstract public function render();

		/**
		 * Optional additional initializtion for control. Can be overriden from child class if needed.
		 * @return [type] [description]
		 */
		public function init() {}

		/**
		 * Settings list
		 *
		 * @since 1.0.0
		 * @var array
		 */
		protected $settings = array();

		/**
		 * Get control value
		 *
		 * @since 1.0.0
		 * @return string control value.
		 */
		public function get_value() {
			return $this->settings['value'];
		}

		/**
		 * Set control value
		 *
		 * @since 1.0.0
		 * @param [type] $value new.
		 */
		public function set_value( $value ) {
			$this->settings['value'] = $value;
		}

		/**
		 * Get control name
		 *
		 * @since 1.0.0
		 * @return string control name.
		 */
		public function get_name() {
			return $this->settings['name'];
		}

		/**
		 * Set control name
		 *
		 * @since 1.0.0
		 * @param [type] $name new control name.
		 * @throws Exception Invalid control name.
		 */
		public function set_name( $name ) {
			$name = (string) $name;
			if ( '' !== $name ) {
				$this->settings['name'] = $name;
			} else {
				throw new Exception( "Invalid control name '" . $name . "'. Name can't be empty." );
			}
		}

		/**
		 * Returns attributes string from attributes array
		 *
		 * @return string
		 */
		public function get_attr_string( $attr = array() ) {

			$result = array();

			foreach ( $attr as $key => $value ) {

				if ( $key === $value ) {
					$result[] = $key;
				} else {
					$result[] = sprintf( '%1$s="%2$s"', $key, $value );
				}

			}

			return implode( ' ', $result );

		}
	}
}
