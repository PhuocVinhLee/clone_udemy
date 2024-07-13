export const formatPrice = (price: number)=>{
return new Intl.NumberFormat("en-US",{
    style: "currency",
    currency: "USD"
}).format(price)
}
import _ from 'lodash';

export const formatResult = (result: string): string[] => {
    // Split the input string by the custom separator
    const separator: string = "#<ab@17943918#@>#";
    const parts: string[] = _.split(result, separator);
    
    // Use _.map to trim the string parts and _.filter to remove empty parts
    const strings: string[] = _.chain(parts)
      .map(part => _.trim(part))
      .filter(part => part !== '')
      .value();
    
    return strings; // Output: ["32", "35", "36"]
  };