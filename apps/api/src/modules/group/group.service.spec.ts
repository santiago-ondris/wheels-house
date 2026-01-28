import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { UploadService } from '../../services/upload.service';
import { EventsService } from '../social/events/events.service';
import { NotificationsRepository } from '../social/notifications/notifications.repository';
import * as GroupCrud from 'src/database/crud/group.crud';
import * as UserCrud from 'src/database/crud/user.crud';
import * as LikesRepository from '../social/likes/likes.repository';
import { CreateGroupDTO, UpdateGroupDTO } from '../../dto/group.dto';

// Mockear dependencias
jest.mock('src/database/crud/group.crud');
jest.mock('src/database/crud/user.crud');
jest.mock('../social/likes/likes.repository');

describe('GroupService', () => {
    let service: GroupService;
    let uploadService: UploadService;
    let eventsService: EventsService;
    let notificationsRepository: NotificationsRepository;

    const mockUploadService = {
        deleteImage: jest.fn().mockResolvedValue(true),
    };

    const mockEventsService = {
        emitGroupCreated: jest.fn(),
    };

    const mockNotificationsRepository = {
        deleteByGroupId: jest.fn().mockResolvedValue(true),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GroupService,
                { provide: UploadService, useValue: mockUploadService },
                { provide: EventsService, useValue: mockEventsService },
                { provide: NotificationsRepository, useValue: mockNotificationsRepository },
            ],
        }).compile();

        service = module.get<GroupService>(GroupService);
        uploadService = module.get<UploadService>(UploadService);
        eventsService = module.get<EventsService>(EventsService);
        notificationsRepository = module.get<NotificationsRepository>(NotificationsRepository);

        jest.clearAllMocks();
    });

    const mockUserToken = {
        username: 'testuser',
        userId: 123,
    } as any;

    const mockUserDB = {
        userId: 123,
        username: 'testuser',
    } as any;

    describe('createGroupService', () => {
        it('debería crear un grupo, asociar autos y emitir evento', async () => {
            const groupData: CreateGroupDTO = {
                name: 'Mi Grupo',
                description: 'Descripción',
                picture: 'http://cloudinary.com/wheels-house/group.jpg',
                featured: false,
                cars: [10, 11]
            } as any;

            jest.spyOn(UserCrud, 'getUserFromUsername').mockResolvedValue(mockUserDB);
            jest.spyOn(GroupCrud, 'createGroup').mockResolvedValue({ groupId: 50, name: 'Mi Grupo' } as any);
            jest.spyOn(GroupCrud, 'createGroupedCars').mockResolvedValue(true as any);

            const result = await service.createGroupService(groupData, mockUserToken);

            expect(result).toBe(true);
            expect(GroupCrud.createGroup).toHaveBeenCalled();
            // Verificar asociación de autos
            expect(GroupCrud.createGroupedCars).toHaveBeenCalledWith([
                { carId: 10, groupId: 50 },
                { carId: 11, groupId: 50 }
            ]);
            // Verificar evento
            expect(eventsService.emitGroupCreated).toHaveBeenCalledWith(expect.objectContaining({
                groupId: 50,
                carCount: 2
            }));
        });
    });

    describe('updateGroupService', () => {
        it('debería actualizar grupo, manejar cambio de imagen y sincronizar autos', async () => {
            const groupId = 50;
            // Estado actual
            const currentGroup = {
                groupId: 50,
                userId: 123,
                picture: 'http://cloudinary.com/wheels-house/old-pic.jpg',
                featured: false
            } as any;
            
            // Autos actuales en el grupo: [10, 11]
            const currentGroupedCars = [
                { carId: 10, groupId: 50 },
                { carId: 11, groupId: 50 }
            ] as any;

            // Update: Nueva foto, mantener auto 10, quitar 11, agregar 12.
            const updates: UpdateGroupDTO = {
                name: 'Nombre Actualizado',
                picture: 'http://cloudinary.com/wheels-house/new-pic.jpg',
                cars: [10, 12]
            } as any;

            // Mocks
            jest.spyOn(GroupCrud, 'getGroupFromId').mockResolvedValue(currentGroup);
            jest.spyOn(GroupCrud, 'updateGroup').mockResolvedValue(true as any);
            jest.spyOn(GroupCrud, 'getGroupedCarsFromGroupId').mockResolvedValue(currentGroupedCars);
            jest.spyOn(GroupCrud, 'createGroupedCars').mockResolvedValue(true as any);
            jest.spyOn(GroupCrud, 'deleteGroupedCarFromGroupIdAndCarId').mockResolvedValue(true as any);

            const result = await service.updateGroupService(groupId, updates);

            expect(result).toBe(true);
            
            // 1. Verificar cambio de foto (debería borrar la vieja)
            expect(uploadService.deleteImage).toHaveBeenCalledWith(expect.stringContaining('old-pic'));

            // 2. Verificar lógica de autos
            // Auto 10: Estaba y sigue -> No hacer nada (ni crear ni borrar)
            // Auto 11: Estaba y NO sigue -> Borrar
            expect(GroupCrud.deleteGroupedCarFromGroupIdAndCarId).toHaveBeenCalledWith(groupId, 11);
            
            // Auto 12: No estaba y sigue -> Crear
            expect(GroupCrud.createGroupedCars).toHaveBeenCalledWith({ groupId, carId: 12 });
        });
    });

    describe('deleteGroupService', () => {
        it('debería eliminar grupo y limpiar dependencias', async () => {
            const groupId = 50;
            const deletedGroup = {
                groupId,
                picture: 'http://cloudinary.com/wheels-house/group-pic.jpg'
            } as any;

            // Mocks
            jest.spyOn(LikesRepository, 'deleteGroupLikes').mockResolvedValue(true as any);
            jest.spyOn(NotificationsRepository.prototype, 'deleteByGroupId').mockResolvedValue(true as any);
            jest.spyOn(GroupCrud, 'deleteGroupedCarsFromGroupId').mockResolvedValue(true as any);
            jest.spyOn(GroupCrud, 'deleteFeedEventsFromGroupId').mockResolvedValue(true as any);
            jest.spyOn(GroupCrud, 'deleteGroupFromId').mockResolvedValue(deletedGroup);

            const result = await service.deleteGroupService(groupId);

            expect(result).toBe(true);

            // Verificar limpieza
            expect(LikesRepository.deleteGroupLikes).toHaveBeenCalledWith(groupId);
            expect(notificationsRepository.deleteByGroupId).toHaveBeenCalledWith(groupId);
            expect(GroupCrud.deleteGroupedCarsFromGroupId).toHaveBeenCalledWith(groupId);
            expect(GroupCrud.deleteFeedEventsFromGroupId).toHaveBeenCalledWith(groupId);
            
            // Verificar eliminación de foto
            expect(uploadService.deleteImage).toHaveBeenCalledWith(expect.stringContaining('group-pic'));
            
            // Eliminación final
            expect(GroupCrud.deleteGroupFromId).toHaveBeenCalledWith(groupId);
        });
    });
});
