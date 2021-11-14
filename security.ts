import * as pathTools from 'path'

/**
 * Checks if a path is a subpath of another path.
 * @param path The path to check.
 * @param parent The base path.
 * @returns `true` if `path` is a subpath of `parent`, `false` otherwise.
 */
const pathInsideOtherPath = (path: string, basePath: string) => {
	const pathParts = chopPath(path)
	const basePathParts = chopPath(basePath)

	// If the path is shorter than the base path, it can't be inside it.
	// Example: 'foo' (length 1) cannot be inside 'foo/bar' (length 2).

	if (pathParts.length < basePathParts.length) {
		return false
	}

	// Check if all first parts of the path equal the base path parts.

	for (let i = 0; i < basePathParts.length; i++) {
		if (pathParts[i] != basePathParts[i]) {
			return false
		}
	}

	// The path is inside the base path.

	return true
}

/**
 * Splits a path into an array of path segments.
 *
 * Example:
 * ```
 * const path = '/foo/bar/baz'
 * const segments = splitPath(path) // => [ 'foo', 'bar', 'baz' ]
 * ```
 *
 * @param path The path to split.
 * @returns An array of path segments.
 */
const chopPath = (path: string) => {
	path = pathTools.resolve(path)

	// Split into parts

	const parts = path.split(pathTools.sep)

	// The first part is always empty because the path starts with a slash.
	// This is guaranteed by path.resolve(). We remove it.

	parts.shift()

	return parts
}

/**
 * Checks if a given path is inside a base path.
 *
 * Example:
 * ```
 * // Absolute:
 * pathIsSafe('/public/file.txt',      '/public') // => true
 * pathIsSafe('/public/../secret.txt', '/public') // => false
 *
 * // Relative:
 * pathIsSafe('public/file.txt',        'public') // => true
 * pathIsSafe('public/../secret.txt',   'public') // => false
 * ```
 *
 * This function is useful to prevent dot-dot-slash attacks.
 * A dot-dot-slash attack may happen when the client sends a request
 * to a server containing a path that navigates outside of the
 * server's root directory.
 * Consider the following example:
 * The client requests: https://example.com/../../../passwords.txt.
 * If the server were to resolve this path, it would navigate outside
 * of the root directory and respond with sensitive private data,
 * which is a major security issue.
 *
 * @param path The path to check.
 * @param basePath The base path.
 * @returns `true` if the path is inside the base path, `false` otherwise.
 */
export const pathIsSafe = (path: string, basePath: string) => {
	return pathInsideOtherPath(pathTools.resolve(path),
		pathTools.resolve(basePath))
}