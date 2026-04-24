import path from 'path'
import {parse} from 'csv-parse/sync'
import fs from 'fs'

/**
 * Reads and parses a CSV file from the specified file path.
 * @param filePath - The relative path to the CSV file to read
 * @returns An array of objects where each object represents a row in the CSV file,
 *          with keys corresponding to the column headers
 * 
 * @remarks
 * - The `columns: true` option uses the first row of the CSV as column names/headers,
 *   transforming each subsequent row into an object with those headers as keys
 * - Empty lines are skipped during parsing
 * - Whitespace is trimmed from all values
 * 
 * @example
 * // data.csv: id,name,email
 * //            1,John,john@example.com
 * //            2,Jane,jane@example.com
 * const data = readCSVData('data/data.csv');
 * // Returns: [{ id: '1', name: 'John', email: 'john@example.com' }, ...]
 */
export function readCSVData(filePath: string): Array<Record<string,any>>{
   const absolutePath = path.resolve(__dirname,'..',filePath)
   const fileContent = fs.readFileSync(absolutePath,'utf-8')
   return parse(fileContent,{
       columns: true,
       skip_empty_lines: true,
       trim: true
   })
}