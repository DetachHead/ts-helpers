/**
 * returns whether the given object has the given propertyName and narrows the type of the object to the specified generic
 */
export function hasPropertyPredicate<T>(object: unknown, propertyName: keyof T): object is T {
  return Object.prototype.hasOwnProperty.call(object, propertyName)
}
