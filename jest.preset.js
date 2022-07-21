/**
 * Note: added `.default` to fix problem with typescript paths
 * see: https://github.com/nrwl/nx/issues/10825
 */
const nxPreset = require('@nrwl/jest/preset').default;

module.exports = { ...nxPreset };
