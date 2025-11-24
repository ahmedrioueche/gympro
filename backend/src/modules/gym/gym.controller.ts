import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { GymService } from './gym.service';

@Controller('gyms')
export class GymController {
    constructor(private readonly gymService: GymService) { }

    @Post()
    create(@Body() createGymDto: any) {
        return this.gymService.create(createGymDto);
    }

    @Get()
    findAll() {
        return this.gymService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.gymService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateGymDto: any) {
        return this.gymService.update(id, updateGymDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.gymService.remove(id);
    }
}
