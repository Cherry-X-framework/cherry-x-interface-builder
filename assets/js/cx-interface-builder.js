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
				this.select.init();
				this.media.init();
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
			},//End CX-Slider

			// CX-Select
			select: {
				init: function() {
					$( document )
						.on( 'ready.cxSelect', this.selectRender.bind( this ) )
						.on( 'cx-control-init', this.selectRender.bind( this ) );
				},

				selectRender: function() {
					var $target = ( event._target ) ? event._target : $( 'body' );
				}
			},//End CX-Select

			// CX-Media
			media: {
				init: function() {
					$( document )
						.on( 'ready.cxMedia', this.mediaRender.bind( this ) )
						.on( 'cx-control-init', this.mediaRender.bind( this ) );
				},

				mediaRender: function() {
					var target   = ( event._target ) ? event._target : $( 'body' ),
						$buttons = $( '.cx-upload-button', target );

					$buttons.each( function() {
						var button = $( this ),
							buttonParent = button.closest('.cx-ui-media-wrap'),
							settings = {
								input: $( '.cx-upload-input', buttonParent ),
								img_holder: $( '.cx-upload-preview', buttonParent ),
								title_text: button.data('title'),
								multiple: button.data('multi-upload'),
								library_type: button.data('library-type'),
							},
							cx_uploader = wp.media.frames.file_frame = wp.media({
								title: settings.title_text,
								button: { text: settings.title_text },
								multiple: settings.multiple,
								library : { type : settings.library_type }
							});

						if ( ! buttonParent.has('input[name*="__i__"]')[ 0 ] ) {
							button.off( 'click.cx-media' ).on( 'click.cx-media', function() {
								cx_uploader.open();
								return !1;
							} ); // end click

							cx_uploader.on('select', function() {
									var attachment     = cx_uploader.state().get( 'selection' ).toJSON(),
										count          = 0,
										input_value    = '',
										new_img_object = $( '.cx-all-images-wrap', settings.img_holder ),
										new_img        = '',
										delimiter      = '';

									if ( settings.multiple ) {
										input_value = settings.input.val();
										delimiter   = ',';
										new_img     = new_img_object.html();
									}

									while( attachment[ count ] ) {
										var img_data    = attachment[ count ],
											return_data = img_data.id,
											mimeType    = img_data.mime,
											img_src     = '',
											thumb       = '';

											switch (mimeType) {
												case 'image/jpeg':
												case 'image/png':
												case 'image/gif':
														if ( img_data.sizes !== undefined ) {
															img_src = img_data.sizes.thumbnail ? img_data.sizes.thumbnail.url : img_data.sizes.full.url;
														}
														thumb = '<img  src="' + img_src + '" alt="" data-img-attr="' + return_data + '">';
													break;
												case 'image/x-icon':
														thumb = '<span class="dashicons dashicons-format-image"></span>';
													break;
												case 'video/mpeg':
												case 'video/mp4':
												case 'video/quicktime':
												case 'video/webm':
												case 'video/ogg':
														thumb = '<span class="dashicons dashicons-format-video"></span>';
													break;
												case 'audio/mpeg':
												case 'audio/wav':
												case 'audio/ogg':
														thumb = '<span class="dashicons dashicons-format-audio"></span>';
													break;
											}

											new_img += '<div class="cx-image-wrap">'+
														'<div class="inner">'+
															'<div class="preview-holder"  data-id-attr="' + return_data +'"><div class="centered">' + thumb + '</div></div>'+
															'<a class="cx-remove-image" href="#"><i class="dashicons dashicons-no"></i></a>'+
															'<span class="title">' + img_data.title + '</span>'+
														'</div>'+
													'</div>';

										input_value += delimiter + return_data;
										count++;
									}

									settings.input.val( input_value.replace( /(^,)/, '' ) ).trigger( 'change' );
									new_img_object.html( new_img );
								} );

							var removeMediaPreview = function( item ) {
								var buttonParent = item.closest( '.cx-ui-media-wrap' ),
									input         = $( '.cx-upload-input', buttonParent ),
									img_holder    = item.parent().parent( '.cx-image-wrap' ),
									img_attr      = $( '.preview-holder', img_holder ).data( 'id-attr' ),
									input_value   = input.attr( 'value' ),
									pattern       = new RegExp( img_attr + '(,*)', 'i' );

									input_value = input_value.replace( pattern, '' );
									input_value = input_value.replace( /(,$)/, '' );
									input.attr( { 'value': input_value } ).trigger( 'change' );
									img_holder.remove();
							};

							// This function remove upload image
							buttonParent.on( 'click', '.cx-remove-image', function () {
								removeMediaPreview( $( this ) );
								return !1;
							});
						}
					} ); // end each

					// Image ordering
					$('.cx-all-images-wrap', target).sortable( {
						items: 'div.cx-image-wrap',
						cursor: 'move',
						scrollSensitivity: 40,
						forcePlaceholderSize: true,
						forceHelperSize: false,
						helper: 'clone',
						opacity: 0.65,
						placeholder: 'cx-media-thumb-sortable-placeholder',
						start:function(){},
						stop:function(){},
						update: function() {
							var attachment_ids = '';

							$('.cx-image-wrap', this).each(
								function() {
									var attachment_id = $('.preview-holder', this).data( 'id-attr' );
										attachment_ids = attachment_ids + attachment_id + ',';
								}
							);

							attachment_ids = attachment_ids.substr(0, attachment_ids.lastIndexOf(',') );
							$(this).parent().siblings('.cx-element-wrap').find('input.cx-upload-input').val( attachment_ids ).trigger( 'change' );
						}
					} );
				}
			}//End CX-Media

		}
	};

	cxInterfaceBuilder.init();

}( jQuery ) );
