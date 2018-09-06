import './style.scss'
import './editor.scss'

import Inspector from './inspect'
import Preview from './preview'

const { __ } = wp.i18n
const { registerBlockType } = wp.blocks
const {	withAPIData } = wp.components
const { Fragment } = wp.element

export default registerBlockType(
  'advanced-gutenberg-blocks/product',
  {
    title: __( 'Product', 'advanced-gutenberg-blocks' ),
    description: __( 'Display WooCommerce Product in your post', 'advanced-gutenberg-blocks' ),
    category: 'common',
    icon: { background: '#D56561', foreground: "#fff", src: 'products' },
    keywords: [
      __( 'woocommerce', 'advanced-gutenberg-blocks' ),
    ],
    attributes: {
      productID: {
        type: 'integer',
      },
			priceColor: {
        type: 'string',
      },
			buttonBackgroundColor: {
        type: 'string',
      },
    },
    edit: props => {

			const { attributes , product, focus, setAttributes } = props
			const { productID, priceColor, buttonBackgroundColor } = attributes

			// Default values
			! priceColor && setAttributes( { priceColor: '#dd1e35' } )
			! buttonBackgroundColor && setAttributes( { buttonBackgroundColor: '#444' } )

      return (
        <Fragment>
          <Inspector { ...{ attributes, setAttributes } } />

	        { !! productID ? (
						<Preview { ...{ product, attributes } } />
	        ) : (
	          <p class="AGB-block-message">{ __( 'Search for a product in the inspector', 'advanced-gutenberg-blocks' ) }</p>
	        ) }

				</Fragment>
      )
  	},
    save: () => {
      return null
    },
  },
)
