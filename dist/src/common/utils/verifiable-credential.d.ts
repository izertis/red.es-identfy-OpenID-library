import { W3CVerifiableCredential } from "../interfaces";
/**
 * Allows to obtain data from a VC given a JSON PATH
 * @param vc The VC from which obtain the data
 * @param path The JSON PATH to consider
 * @returns Undefined if there is not data, otherwise, the contained information
 */
export declare function extractFromCredential(vc: W3CVerifiableCredential, path: string): any;
