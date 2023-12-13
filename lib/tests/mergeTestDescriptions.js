import { all } from 'deepmerge'

/**
 * @param {...object} args
 * @returns {object}
 */
export default function mergeTestDescriptions(...args) {
  return all(args)
}
