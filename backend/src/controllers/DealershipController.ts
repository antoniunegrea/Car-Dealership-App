import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Dealership } from '../model/Dealership';
import { ILike } from 'typeorm';
import { logUserAction } from '../utils/logService';

const dealershipRepository = AppDataSource.getRepository(Dealership);

export class DealershipController {
    // Create a new dealership
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const dealership = dealershipRepository.create(req.body);
            const result = await dealershipRepository.save(dealership);
            await logUserAction((req as any).user, 'CREATE_DEALERSHIP', `Dealership ID: ${result[0]?.id}`);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error creating dealership' });
            console.log("Error creating dealership: "+ error);
        }
    }

    // Get all dealerships with filtering
    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const { searchTerm, sortBy, order, selectedDealershipId } = req.query;

            const where: any[] = [];

            if (searchTerm) {
                where.push({
                    name: ILike(`%${searchTerm}%`)
                });
                where.push({
                    location: ILike(`%${searchTerm}%`)
                });
            }

            const dealerships = await dealershipRepository.find({
                where: searchTerm ? where : {},
                order: { [sortBy as string]: order },
                relations: ['cars']
            });

            res.json(dealerships);
        } catch (error) {
            console.error('Error fetching dealerships:', error);
            res.status(500).json({ error: 'Error fetching dealerships' });
        }
    };


    // Get a single dealership by ID
    getOne = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid dealership ID' });
                return;
            }

            const dealership = await dealershipRepository.findOne({
                where: { id },
                relations: ['cars']
            });
            
            if (!dealership) {
                res.status(404).json({ error: 'Dealership not found' });
                return;
            }
            
            res.json(dealership);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching dealership' });
        }
    }

    // Update a dealership
    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid dealership ID' });
                return;
            }

            const dealership = await dealershipRepository.findOne({
                where: { id }
            });
            
            if (!dealership) {
                res.status(404).json({ error: 'Dealership not found' });
                return;
            }

            dealershipRepository.merge(dealership, req.body);
            const result = await dealershipRepository.save(dealership);
            await logUserAction((req as any).user, 'UPDATE_DEALERSHIP', `Dealership ID: ${id}`);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error updating dealership' });
        }
    }

    // Delete a dealership
    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid dealership ID' });
                return;
            }

            const dealership = await dealershipRepository.findOne({
                where: { id }
            });
            
            if (!dealership) {
                res.status(404).json({ error: 'Dealership not found' });
                return;
            }

            await dealershipRepository.remove(dealership);
            await logUserAction((req as any).user, 'DELETE_DEALERSHIP', `Dealership ID: ${id}`);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Error deleting dealership' });
        }
    }
} 