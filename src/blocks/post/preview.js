import classnames from 'classnames'

const { __ } = wp.i18n
const { Component } = wp.element

export default class Preview extends Component {

	state = {
		featuredImage: false,
		post: false,
		author: false,
		category: false,
	}

	getPost = () => {

		const { postID, postType } = this.props.attributes

    // Singular - change this shit soon
    const singularType = postType.substring(0, postType.length-1);

		const postQuery = new wp.api.models[singularType]( { id: postID } );

		// Fetch post via API
		postQuery.fetch().then( post => {
			this.setState( { post: post } )

			// Get author
			postQuery.getAuthorUser().done( author => {
				this.setState( { author: author.attributes.name } )
			} )

      // Get Categories
      if( postType == "Posts") {
  			postQuery.getCategories().done( categories => {
  				this.setState( { category: categories[0].name } )
  			} )
      }

			// Get Featured Image
			postQuery.getFeaturedMedia().done( media => {
				this.setState( { featuredImage: media.attributes.media_details.sizes.medium.source_url } )
			} )

		} )
	}

	componentWillMount() {
    this.getPost()
  }

	componentDidUpdate(lastProps, lastStates) {

		if( lastProps.attributes.postID != this.props.attributes.postID ) {
			this.getPost()
		}
	}

  render() {

		const { showImage, showCategory, showAuthor } = this.props.attributes
		const { post, featuredImage, category, author } = this.state

		// Get HTML Excerpt
		const getExcerpt = () => {
  		return {__html: this.state.post.excerpt.rendered }
		}

    return (
			!! post ? (
				<div className="wp-block-advanced-gutenberg-blocks-post">
					{ !! featuredImage && showImage && (
						<a
							href={ post.link }
							className="wp-block-advanced-gutenberg-blocks-post__image"
							style={ {
								backgroundImage: `url(${featuredImage})`
							} }
						/>
					) }
					<div className="wp-block-advanced-gutenberg-blocks-post__content">
						<p className="wp-block-advanced-gutenberg-blocks-post__title">
							<a href={ post.link }>{ post.title.rendered }</a>
						</p>
						<p className="wp-block-advanced-gutenberg-blocks-post__metas">
							<em>
								{ !! category && showCategory && (
								<span> { __( 'In', 'advanced-gutenberg-blocks' ) + ' ' + category } </span>
								) }
								{ !! author && showAuthor && (
								<span> { __( 'By', 'advanced-gutenberg-blocks' ) + ' ' + author } </span>
								) }
							</em>
						</p>
						<div
							className="wp-block-advanced-gutenberg-blocks-post__excerpt"
							dangerouslySetInnerHTML={ getExcerpt() }
						/>
						<p class="wp-block-advanced-gutenberg-blocks-product__actions">
							<a href={ post.link } className="wp-block-advanced-gutenberg-blocks-post__button">
								{ __( 'Read more', 'advanced-gutenberg-blocks' ) }
							</a>
						</p>
					</div>
				</div>
			) : (
				<p class="AGB-block-message">{ __( 'Loading post...', 'advanced-gutenberg-blocks' ) }</p>
			)
    )
  }
}
