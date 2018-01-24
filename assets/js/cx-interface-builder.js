/**
 * Interface Builder
 */
;( function( $ ) {

	'use strict';

	var cxInterfaceBuilder = {

		init: function() {
			// Component Init
			this.component.init();
			$( document ).on( 'cxFramework:interfaceBuilder:component', this.component.init.bind( this.component ) );

			// Control Init
			this.control.init();
			$( document ).on( 'cxFramework:interfaceBuilder:control', this.control.init.bind( this.control ) );
		},

		component: {
			tabClass:           '.cx-tab',
			accordionClass:     '.cx-accordion',
			toggleClass:        '.cx-toggle',

			buttonClass:        '.cx-component__button',
			contentClass:       '.cx-settings__content',

			buttonActiveClass:  'active',
			showClass:          'show',

			localStorage:        {},

			init: function () {
				this.localStorage = this.getState() || {};

				this.componentInit( this.tabClass );
				this.componentInit( this.accordionClass );
				this.componentInit( this.toggleClass );

				this.addEvent();
			},

			addEvent: function() {
				$( 'body' )
					.off( 'click.cxInterfaceBuilder' )
					.on( 'click.cxInterfaceBuilder',
						this.tabClass + ' ' + this.buttonClass + ', ' +
						this.toggleClass + ' ' + this.buttonClass + ', ' +
						this.accordionClass + ' ' + this.buttonClass,

						this.componentClick.bind( this )
					);
			},

			componentInit: function( componentClass ) {
				var _this = this,
					components = $( componentClass ),
					componentId = null,
					button = null,
					contentId = null,
					notShow = '';

				components.each( function( index, component ) {
					component   = $( component );
					componentId = component.data( 'compotent-id' );

					switch ( componentClass ) {
						case _this.toggleClass:
							if ( _this.localStorage[ componentId ] && _this.localStorage[ componentId ].length ) {
								notShow = _this.localStorage[ componentId ].join( ', ' );
							}

							$( _this.contentClass, component )
								.not( notShow )
								.addClass( _this.showClass )
								.prevAll( _this.buttonClass )
								.addClass( _this.buttonActiveClass );
						break;

						case _this.tabClass:
						case _this.accordionClass:
							if ( _this.localStorage[ componentId ] ) {
								contentId = _this.localStorage[ componentId ][ 0 ];
								button = $( '[data-content-id="' + contentId + '"]', component );
							} else {
								button = $( _this.buttonClass, component ).eq( 0 );
								contentId = button.data( 'content-id' );
							}

							_this.showElement( button, component, contentId );
						break;
					}
				} );
			},

			componentClick: function( event ) {
				var $target      = $( event.target ),
					$parent      = $target.closest( this.tabClass + ', ' + this.accordionClass + ', ' + this.toggleClass ),
					expr          = new RegExp( this.tabClass + '|' + this.accordionClass + '|' + this.toggleClass ),
					componentName = $parent[0].className.match( expr )[ 0 ].replace( ' ', '.' ),
					contentId     = $target.data( 'content-id' ),
					componentId   = $parent.data( 'compotent-id' ),
					activeFlag    = $target.hasClass( this.buttonActiveClass ),
					itemClosed;

				switch ( componentName ) {
					case this.tabClass:
						if ( ! activeFlag ) {
							this.hideElement( $parent );
							this.showElement( $target, $parent, contentId );

							this.localStorage[ componentId ] = new Array( contentId );
							this.setState();
						}
					break;

					case this.accordionClass:
						this.hideElement( $parent );

						if ( ! activeFlag ) {
							this.showElement( $target, $parent, contentId );

							this.localStorage[ componentId ] = new Array( contentId );
						} else {
							this.localStorage[ componentId ] = {};
						}
						this.setState();
					break;

					case this.toggleClass:
						$target
							.toggleClass( this.buttonActiveClass )
							.nextAll( contentId )
							.toggleClass( this.showClass );

						if ( Array.isArray( this.localStorage[ componentId ] ) ) {
							itemClosed = this.localStorage[ componentId ].indexOf( contentId );

							if ( -1 !== itemClosed ) {
								this.localStorage[ componentId ].splice( itemClosed, 1 );
							} else {
								this.localStorage[ componentId ].push( contentId );
							}

						} else {
							this.localStorage[ componentId ] = new Array( contentId );
						}

						this.setState();
					break;
				}
				$target.blur();

				return false;
			},

			showElement: function ( button, holder, contentId ) {
				button
					.addClass( this.buttonActiveClass );

				holder
					.data( 'content-id', contentId );

				$( contentId, holder )
					.addClass( this.showClass );
			},

			hideElement: function ( holder ) {
				var contsntId = holder.data( 'content-id' );

				$( '[data-content-id="' + contsntId + '"]', holder )
					.removeClass( this.buttonActiveClass );

				$( contsntId, holder )
					.removeClass( this.showClass );
			},

			getState: function() {
				try {
					return JSON.parse( localStorage.getItem( 'interface-builder' ) );
				} catch ( e ) {
					return false;
				}
			},

			setState: function() {
				try {
					localStorage.setItem( 'interface-builder', JSON.stringify( this.localStorage ) );
				} catch ( e ) {
					return false;
				}
			}
		},

		control: {
			init: function () {
				this.switcher.init();
				this.checkbox.init();
				this.radio.init();
				this.slider.init();
			},

			// CX-Switcher
			switcher: {
				switcherClass: '.cx-switcher-wrap',
				trueClass: '.cx-input-switcher-true',
				falseClass: '.cx-input-switcher-false',

				init: function() {
					$( 'body' ).on( 'click.cxSwitcher', this.switcherClass, this.switchState.bind( this ) );
				},

				switchState: function( event ) {
					var $this       = $( event.currentTarget ),
						$inputTrue  = $( this.trueClass, $this ),
						$inputFalse = $( this.falseClass, $this ),
						flag        = $inputTrue[0].checked;

					$inputTrue.attr( 'checked', ( flag ) ? false : true );
					$inputFalse.attr( 'checked', ( ! flag ) ? false : true );
				}

			},//End CX-Switcher

			// CX-Checkbox
			checkbox: {
				inputClass: '.cx-checkbox-input[type="hidden"]:not([name*="__i__"])',
				itemClass: '.cx-checkbox-label, .cx-checkbox-item',

				init: function() {
					console.log(this);
					$( 'body' ).on( 'click.cxCheckbox', this.itemClass, this.switchState.bind( this ) );
				},

				switchState: function( event ) {
					var $_input = $( event.currentTarget ).siblings( this.inputClass ),
						flag    = $_input[0].checked;

					$_input.val( ( flag ) ? 'false' : 'true' ).attr( 'checked', ( flag ) ? false : true );
				}
			},//End CX-Checkbox

			// CX-Radio
			radio: {
				inputClass: '.cx-radio-input:not([name*="__i__"])',

				init: function() {
					$( 'body' ).on( 'click.cxRadio', this.inputClass, this.switchState.bind( this ) );
				},

				switchState: function( event ) {
					var $this = $( event.currentTarget );
				}
			},//End CX-Radio

			// CX-Slider
			slider: {
				init: function() {
					$( 'body' ).on( 'input.cxSlider change.cxSlider', '.cx-slider-unit, .cx-ui-stepper-input', this.changeHandler.bind( this ) );
				},

				changeHandler: function( event ) {
					var $this          = $( event.currentTarget ),
						$sliderWrapper = $this.closest( '.cx-slider-wrap' ),
						targetClass    = ( ! $this.hasClass( 'cx-slider-unit' ) ) ? '.cx-slider-unit' : '.cx-ui-stepper-input';

					$( targetClass, $sliderWrapper ).val( $this.val() );
				}
			}//End CX-Slider

		}
	};

	cxInterfaceBuilder.init();

}( jQuery ) );
