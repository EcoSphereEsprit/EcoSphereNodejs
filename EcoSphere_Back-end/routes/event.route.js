import express from 'express';
import { createEvent, getEventById, updateEvent, deleteEvent,getAllEvents } from '../controllers/event.controller.js';

const router = express.Router();

router.post('/', createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
