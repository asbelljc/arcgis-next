import type { NextApiRequest, NextApiResponse } from 'next';
import { executeQueryJSON } from '@arcgis/core/rest/query';

const PLANT_URL =
  'https://services1.arcgis.com/4yjifSiIG17X0gW4/arcgis/rest/services/PowerPlants_WorldResourcesInstitute/FeatureServer/0';

type Data = {
  types: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data> // generic type; accepts our specified Data type
) {
  const query = {
    outFields: ['fuel1'],
    where: '1=1',
    returnDistinctValues: true,
    returnGeometry: false,
  };

  const results = await executeQueryJSON(PLANT_URL, query);
  const values = results.features
    .map((feature) => feature.attributes['fuel1'])
    .filter(Boolean) // this trick passes each item to the Boolean() object, coercing truthy/falsy values to true/false (thus eliminating nulls and undefineds)
    .sort();

  res.status(200).json({ types: values });
}
