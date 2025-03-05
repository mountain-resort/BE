import { BadRequestException } from '@nestjs/common';

export default function validateSortField(
  sortBy: string,
  validFields: string[],
) {
  if (!validFields.includes(sortBy))
    throw new BadRequestException(
      `Invalid sortBy field. Valid fields: ${validFields.join(' ,')}`,
    );
}
