export function flattenChildren<T>(children: any[]): T[] {
    let nodes: any[] = []
    if (Array.isArray(children)) {
        for (let child of children) {
            if (Array.isArray(child)) {
                nodes = nodes.concat(flattenChildren(child))
            } else if (child) {
                nodes.push(child)
            }
        }
    }
    return nodes
}
