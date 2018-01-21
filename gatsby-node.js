
exports.onCreateNode = (
  { boundActionCreators, node },
  options
) => {
  const { type } = node.internal

  if (type !== (options.matchNodeType)) return

  const { createNodeField } = boundActionCreators

  options.extract.forEach(extractor => {
    const result = node.fileAbsolutePath.replace(extractor.selector, extractor.replacer)

    if (result !== null && result !== node.fileAbsolutePath) {
      createNodeField({
        node,
        name: extractor.name,
        value: result
      })
    }
  })
}
