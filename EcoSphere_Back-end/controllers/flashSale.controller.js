import FlashSale from '../models/flashSale.model.js'


export const postFlashSale = async (req, res) => {
    try {
        if (!validationResult(req).isEmpty()) {
            res.status(400).json({ errors: validationResult(req).array() })
        } else {
            const flashSale = new FlashSale({
                product: req.body.product,
                price: req.body.price,
                discountPrice: req.body.discountPrice,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                imageUrl: `${req.protocol}://${req.get('host')}/img/${req.file.filename}`
            });
            await flashSale.save();
            res.status(201).send(flashSale);
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

export const findAll = async (req, res) => {
    try {
        const flashSales = await FlashSale.find();
        res.status(200).send(flashSales);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const getOneById = async (req, res) => {
    try {
        const flashSale = await FlashSale.findById(req.params.id);
        if (!flashSale) {
            return res.status(404).json({ message: 'Vente Flash non trouvée' });
        }
        res.status(200).send(flashSale);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const updateOneById = async (req, res) => {
    try {
        const flashSale = await FlashSale.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!flashSale) {
            return res.status(404).json({ message: 'Vente Flash non trouvée' });
        }
        res.status(200).send(flashSale);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const deleteOneById = async (req, res) => {
    try {
        const flashSale = await FlashSale.findByIdAndDelete(req.params.id);
        if (!flashSale) {
            return res.status(404).json({ message: 'Vente Flash non trouvée' });
        }
        res.status(200).send(flashSale);
    } catch (error) {
        res.status(400).send(error);
    }
}

