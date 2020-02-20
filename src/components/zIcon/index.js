import zIcon from './zIcon'

const requireAll = requireContext => requireContext.keys().map(requireContext)
const svgFiles = require.context('./svg', false, /\.svg$/)
// const iconList = svgFiles.keys().map(item => svgFiles(item))
requireAll(svgFiles)

export default zIcon
