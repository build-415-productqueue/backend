const db = require('../data/dbConfig.js');
const Projects = require('../models/projects.js');
const Users = require('../models/users.js');
// const knexfile = require('../knexfile.js');
// const knex = require('knex')(knexfile);

test.todo('getByProjectId');

describe('projects model', () => {
    beforeEach(async () => { 
            return await db.raw(
              'TRUNCATE "organizations", users, projects, comments RESTART IDENTITY CASCADE'
            );
    });

    describe('insert', () => {
        it('should insert projects', async () => {
            const [org] = await Users.newOrg({
                name: "new company"
            });
            
            const user = await Users.newUser({
                first_name: "Kevin",
                last_name: "Smith",
                org_id: org,
                email: "thisisanewemail@newemailforsure.com",
                password: "password"
            });
            
            await Projects.newProject({ 
                user_id: user.id,
                name: 'projects tester',
                description: 'this project is for a test',
                status: 'pending',
            });

            const projects = await db('projects');
            expect(projects).toHaveLength(1);
        });

        it('should return the added project', async () => {
            const [org] = await Users.newOrg({
                name: "new copany"
            });
            
            const user = await Users.newUser({
                first_name: "Kevin",
                last_name: "Smith",
                org_id: org,
                email: "random@random.com",
                password: "password"
            });
            
            const project = await Projects.newProject({ 
                user_id: user.id,
                name: 'projects tester',
                description: 'this project is for a test',
                status: 'pending',
            });

            expect(project.name).toBe('projects tester');
            expect(project.description).toBe('this project is for a test');
            expect(project.status).toBe('pending');
        });
    });

    describe('get', () => {
        it('should get all projects', async () => {
            const [org] = await Users.newOrg({
                name: "new company"
            });
            
            const user = await Users.newUser({
                first_name: "Kevin",
                last_name: "Smith",
                org_id: org,
                email: "randomer@randomer.com",
                password: "password"
            });
            
            await Projects.newProject({ 
                user_id: user.id,
                name: 'projects tester',
                description: 'this project is for a test',
                status: 'pending',
            });

            const projects = await Projects.getAll();
            expect(projects.length).toBe(1)
        });

        it('should get all projects for a user', async () => {
            const [org] = await Users.newOrg({
                name: "new company"
            });
            
            const user = await Users.newUser({
                first_name: "Kevin",
                last_name: "Smith",
                org_id: org,
                email: "thisisanewemail@newemailforsure.com",
                password: "password"
            });
            
            await Projects.newProject({ 
                user_id: user.id,
                name: 'projects tester',
                description: 'this project is for a test',
                status: 'pending',
            });

            await Projects.newProject({ 
                user_id: user.id,
                name: 'another projects tester',
                description: 'this another project is for a test',
                status: 'pending',
            });

            const projects = await Projects.getAllByUserId(user.id);
            expect(projects.length).toBe(2);
        });
    });

    describe('delete', () => {
        it('should delete a project', async () => {
            const [org] = await Users.newOrg({
                name: "new company"
            });
            
            const user = await Users.newUser({
                first_name: "Kevin",
                last_name: "Smith",
                org_id: org,
                email: "randomer@randomer.com",
                password: "password"
            });
            
            const project = await Projects.newProject({ 
                user_id: user.id,
                name: 'projects tester',
                description: 'this project is for a test',
                status: 'pending',
            });

            const projects = await Projects.removeProject(project.id);
            expect(projects.length).toBeFalsy();
        });
    });

    describe('put', () => {
        it('should update project name', async () => {
            const [org] = await Users.newOrg({
                name: "new company"
            });
            
            const user = await Users.newUser({
                first_name: "Kevin",
                last_name: "Smith",
                org_id: org,
                email: "randomer@randomer.com",
                password: "password"
            });
            
            const project = await Projects.newProject({ 
                user_id: user.id,
                name: 'projects tester',
                description: 'this project is for a test',
                status: 'pending',
            });
            
            const updateProj = await Projects.updateProject(project.id, { 
                name: 'update project name test',
            });
            
            expect(updateProj.name).toBe('update project name test');
        });
    });
});
