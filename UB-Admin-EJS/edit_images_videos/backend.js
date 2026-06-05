import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
// import { GridFsStorage } from 'multer-gridfs-storage';
// import { ObjectId } from 'mongodb';
import { connectToDatabase } from './connection.js';

dotenv.config();
// import { connectToDatabase } from './connection.js';
const app = express();
app.use(cors());
app.use(express.json());
 const storage = multer.memoryStorage();

const upload = multer({
    storage
});


const port = 5000;
 
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running!' });
}); 

app.patch('/projects_video/:slug',
    upload.fields([
        { name: 'masterPlanImages', maxCount: 50 },
        { name: 'floorPlanImages', maxCount: 50 },
        { name: 'exclusiveClubImages', maxCount: 50 },
        { name: 'facilitiesNearbyImages', maxCount: 50 },
        { name: 'constructionUpdateImages', maxCount: 50 }
    ]),
    async (req, res) => {

        try {

            const projectCollection = await connectToDatabase();

            const project = await projectCollection.findOne({
                slug: req.params.slug
            });

            if (!project) {

                return res.status(404).json({
                    message: 'Project not found'
                });
            }

            const updateData = {};

            const fields = [
                'masterPlanImages',
                'floorPlanImages',
                'exclusiveClubImages',
                'facilitiesNearbyImages',
                'constructionUpdateImages'
            ];

            fields.forEach((field) => {

                if (req.files[field]) {

                    const oldImages = project[field] || [];

                    const newImages = req.files[field].map(
                        (file) => file.originalname
                    );

                    updateData[field] = [
                        ...oldImages,
                        ...newImages
                    ];
                }
            });

            await projectCollection.updateOne(
                {
                    slug: req.params.slug
                },
                {
                    $set: updateData
                }
            );

            res.status(200).json({
                success: true,
                message: 'Images Updated Successfully'
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    }
);


app.get('/projects', async (req, res) => {
    try {
    const projectCollection = await connectToDatabase();        
    const projects = await projectCollection.find({}).toArray();
    res.status(200).json(projects); 
    } catch (error) {
    console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});