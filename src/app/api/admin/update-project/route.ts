import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const projectName = formData.get('projectName') as string;
        
        // 1. Load Data
        const filePath = path.join(process.cwd(), 'src', 'lib', 'projects-data.json');
        const fileData = await fs.readFile(filePath, 'utf8');
        let projects = JSON.parse(fileData);

        // 2. Find Project
        const index = projects.findIndex((p: any) => p.projectName === projectName);
        if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

        // 3. Logic for Images
        const images = formData.getAll('images') as File[];
        let finalImageUrls = projects[index].imageUrls || [];

        // Check if new images were uploaded (size check prevents empty triggers)
        if (images.length > 0 && images[0] instanceof File && images[0].size > 0) {
            const uploadDir = path.join(process.cwd(), 'public', 'projects', projectName);
            
            // Delete old directory to clear old images completely
            try {
                await fs.rm(uploadDir, { recursive: true, force: true });
            } catch (err) { /* Directory didn't exist */ }

            await fs.mkdir(uploadDir, { recursive: true });

            const newImagePaths: string[] = [];
            for (let i = 0; i < images.length; i++) {
                const file = images[i];
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const ext = file.name.split('.').pop() || 'png';
                const fileName = `${i + 1}.${ext}`;
                const fullPath = path.join(uploadDir, fileName);

                await fs.writeFile(fullPath, buffer);
                newImagePaths.push(`/projects/${projectName}/${fileName}`);
            }
            finalImageUrls = newImagePaths;
        }

        // 4. Update JSON entry
        projects[index] = {
            ...projects[index],
            description: formData.get('description'),
            learned: formData.get('learned'),
            technologies: JSON.parse(formData.get('technologies') as string),
            githubUrl: formData.get('githubUrl'),
            liveUrl: formData.get('liveUrl'),
            imageUrls: finalImageUrls // Update images list in JSON
        };

        // 5. Save and Revalidate
        await fs.writeFile(filePath, JSON.stringify(projects, null, 2));
        
        // Tells Next.js to purge cached versions of the portfolio data
        revalidatePath('/');
        revalidatePath('/api/admin/get-projects');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update failed:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}