const iconpicker = {
	iconSets: {},
	iconSetsKey: 'cx-icon-sets',

	init: function() {

		$( this.setIconsSets.bind( this, window.CxIconSets ) );
		$( this.render.bind( this ) );

		$( document )
			//.on( 'ready.cxIconpicker', this.setIconsSets.bind( this, window.CxIconSets ) )
			//.on( 'ready.cxIconpicker', this.render.bind( this ) )
			.on( 'cx-control-init', this.render.bind( this ) );
	},

	setIconsSets: function( iconSets ) {
		var icons,
			_this = this;

		if ( iconSets ) {
			icons  = ( iconSets.response ) ? iconSets.response.CxIconSets : iconSets;

			$.each( icons, function( name, data ) {
				_this.iconSets[name] = data;
			} );

			_this.setState( _this.iconSetsKey, _this.iconSets );
		}
	},

	getIconsSets: function() {
		var iconSets = this.getState( this.iconSetsKey );

		if ( iconSets ) {
			this.iconSets = iconSets;
		}
	},

	render: function( event ) {
		var target = ( event._target ) ? event._target : $( 'body' ),
			$picker = $( '.cx-ui-iconpicker:not([name*="__i__"])', target ),
			_this = this;

		if ( $picker[0] ) {
			this.getIconsSets();

			$picker.each( function() {
				var $this   = $( this ),
					set     = $this.data( 'set' ),
					setData = _this.iconSets[set];

				if ( $this.length && setData.icons ) {
					$this.iconpicker({
						icons: setData.icons,
						iconBaseClass: setData.iconBase,
						iconClassPrefix: setData.iconPrefix,
						animation: false,
						fullClassFormatter: function( val ) {
							var prefix = '';

							if ( setData.iconBase ) {
								prefix += setData.iconBase + ' ';
							}

							if ( setData.iconPrefix ) {
								prefix += setData.iconPrefix;
							}

							return prefix + val;
						}
					}).on( 'iconpickerUpdated', function() {
						$( this ).trigger( 'change' );

						$( window ).trigger( {
							type: 'cx-control-change',
							controlName: $( this ).attr( 'name' ),
							controlStatus: $( this ).val()
						} );
					});
				}

				var iconCSSID = set + '-css',
					iconCSSExists = !! $( 'link#' + iconCSSID ).length;

				if ( setData && setData.iconCSS && ! iconCSSExists ) {

					if ( setData.iconDepends ) {

						if ( ! Array.isArray( setData.iconDepends ) ) {
							setData.iconDepends = [ setData.iconDepends ];
						}

						for ( var i = 0; i < setData.iconDepends.length; i++ ) {
							var iconDependExists = !! $( 'link[href="' + setData.iconDepends[i] + '"]' ).length;

							if ( ! iconDependExists ) {
								$( 'head' ).append( '<link rel="stylesheet" href="' + setData.iconDepends[i] + '">' );
							}
						}
					}

					$( 'head' ).append( '<link rel="stylesheet" id="' + iconCSSID + '" href="' + setData.iconCSS + '">' );
				}
			} );
		}
	},

	getState: function( key ) {
		try {
			return JSON.parse( window.sessionStorage.getItem( key ) );
		} catch ( e ) {
			return false;
		}
	},

	setState: function( key, data ) {
		try {
			window.sessionStorage.setItem( key, JSON.stringify( data ) );
		} catch ( e ) {
			return false;
		}
	}
};

export default iconpicker;