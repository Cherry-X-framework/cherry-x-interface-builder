<?php
/**
 * Class for the building colorpicker elements.
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( ! class_exists( 'CX_Control_Colorpicker' ) ) {

	/**
	 * Class for the building CX_Control_Colorpicker elements.
	 */
	class CX_Control_Colorpicker extends CX_Controls_Base {

		/**
		 * Default settings.
		 *
		 * @since 1.0.0
		 * @var array
		 */
		public $defaults_settings = array(
			'id'     => 'cx-colorpicker-id',
			'name'   => 'cx-colorpicker-name',
			'value'  => '',
			'label'  => '',
			'class'  => '',
		);

		/**
		 * Render html UI_Colorpicker.
		 *
		 * @since 1.0.0
		 */
		public function render() {

			$html  = '';
			$class = implode( ' ',
				array(
					$this->settings['class'],
				)
			);

			$html .= '<div class="cx-ui-container ' . esc_attr( $class ) . '">';
				if ( '' !== $this->settings['label'] ) {
					$html .= '<label class="cx-label" for="' . esc_attr( $this->settings['id'] ) . '">' . esc_html( $this->settings['label'] ) . '</label> ';
				}
				$html .= '<div class="cx-ui-colorpicker-wrapper">';
					$html .= '<input type="text" id="' . esc_attr( $this->settings['id'] ) . '" class="cx-ui-colorpicker" name="' . esc_attr( $this->settings['name'] ) . '" value="' . esc_html( $this->settings['value'] ) . '"/>';
				$html .= '</div>';
			$html .= '</div>';

			return $html;

		}
	}
}
