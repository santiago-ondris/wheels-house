import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from '../../services/upload.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../services/email.service';
import { NotificationsRepository } from '../social/notifications/notifications.repository';
import * as UserCrud from 'src/database/crud/user.crud';
import * as CarCrud from 'src/database/crud/car.crud';
import * as GroupCrud from 'src/database/crud/group.crud';
import * as FollowsRepository from '../social/follows/follows.repository';
import * as LikesRepository from '../social/likes/likes.repository';

// Mockear modulos externos CRUD/Repositorios
jest.mock('src/database/crud/user.crud');
jest.mock('src/database/crud/car.crud');
jest.mock('src/database/crud/group.crud');
jest.mock('../social/follows/follows.repository');
jest.mock('../social/likes/likes.repository');

describe('UserService', () => {
  let service: UserService;
  let uploadService: UploadService;
  let notificationsRepository: NotificationsRepository;

  const mockUploadService = {
    deleteImage: jest.fn().mockResolvedValue(true),
  };

  const mockNotificationsRepository = {
    deleteByCarId: jest.fn().mockResolvedValue(true),
    deleteByGroupId: jest.fn().mockResolvedValue(true),
    deleteByUserId: jest.fn().mockResolvedValue(true),
  };

  const mockEmailService = {};
  const mockJwtService = {};
  const mockConfigService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UploadService, useValue: mockUploadService },
        { provide: NotificationsRepository, useValue: mockNotificationsRepository },
        { provide: EmailService, useValue: mockEmailService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    uploadService = module.get<UploadService>(UploadService);
    notificationsRepository = module.get<NotificationsRepository>(NotificationsRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteUserService', () => {
    // Datos de prueba básicos
    const mockUserToken = {
      username: 'testuser',
      userId: 123,
      email: 'test@example.com',
      iat: 1,
      exp: 1,
    };

    const mockUserDB = {
        userId: 123,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashedpassword',
        picture: 'http://cloudinary.com/wheels-house/user-pic.jpg',
        createdDate: new Date(),
        biography: 'Bio',
        defaultSortPreference: 'id:desc'
    } as any;

    it('should delete a user and perform all necessary cleanup', async () => {
      // 1. Configurar Mocks
      // El usuario existe
      jest.spyOn(UserCrud, 'getUserFromUsername').mockResolvedValue(mockUserDB);
      
      // El usuario tiene autos
      const mockCars = [
        { carId: 10, userId: 123, name: 'Car 1' },
        { carId: 11, userId: 123, name: 'Car 2' }
      ] as any;
      jest.spyOn(CarCrud, 'getCarsFromUserId').mockResolvedValue(mockCars);

      // El usuario tiene grupos
      const mockGroups = [
        { groupId: 50, userId: 123, name: 'Group 1', picture: 'http://cloudinary.com/wheels-house/group-pic.jpg' }
      ] as any;
      jest.spyOn(GroupCrud, 'getGroupsFromUserId').mockResolvedValue(mockGroups);

      // Fotos de autos
      jest.spyOn(CarCrud, 'getPicturesFromCar').mockResolvedValue([
        { carPictureId: 100, carId: 10, url: 'http://cloudinary.com/wheels-house/car1.jpg', order: 0 }
      ] as any);

      // Mocks de eliminación (Retornan éxito))
      jest.spyOn(LikesRepository, 'deleteCarLikes').mockResolvedValue(true as any);
      jest.spyOn(CarCrud, 'deleteFeedEventsFromCarId').mockResolvedValue(true as any);
      jest.spyOn(GroupCrud, 'deleteGroupedCarsFromCarId').mockResolvedValue(true as any);
      jest.spyOn(CarCrud, 'deleteAllCarPictures').mockResolvedValue([] as any); // Usualmente retorna fotos borradas, mock específico más simple abajo si es necesario

      jest.spyOn(LikesRepository, 'deleteGroupLikes').mockResolvedValue(true as any);
      
      jest.spyOn(GroupCrud, 'deleteFeedEventsFromGroupId').mockResolvedValue(true as any);
      jest.spyOn(GroupCrud, 'deleteGroupedCarsFromGroupId').mockResolvedValue(true as any);

      jest.spyOn(CarCrud, 'deleteCarsFromUserId').mockResolvedValue([] as any);
      jest.spyOn(GroupCrud, 'deleteGroupsFromUserId').mockResolvedValue([] as any);
      
      jest.spyOn(UserCrud, 'deleteSearchHistoryFromUserId').mockResolvedValue(true as any);
      jest.spyOn(UserCrud, 'deleteFeedEventsFromUserId').mockResolvedValue(true as any);
      jest.spyOn(UserCrud, 'deleteUserGameAttemptsFromUserId').mockResolvedValue(true as any);
      
      jest.spyOn(LikesRepository, 'deleteUserLikes').mockResolvedValue(true as any);
      jest.spyOn(FollowsRepository, 'deleteUserFollows').mockResolvedValue(true as any);
      
      jest.spyOn(UserCrud, 'deleteUserFromUsername').mockResolvedValue(mockUserDB);

      // 2. Ejecutar
      const result = await service.deleteUserService(mockUserToken);

      // 3. Verificar
      expect(result).toBe(true);

      // Verificar búsqueda de usuario
      expect(UserCrud.getUserFromUsername).toHaveBeenCalledWith('testuser');

      // Verificar bucle de limpieza de autos (para cada auto)
      expect(LikesRepository.deleteCarLikes).toHaveBeenCalledWith(10);
      expect(LikesRepository.deleteCarLikes).toHaveBeenCalledWith(11);
      expect(CarCrud.deleteFeedEventsFromCarId).toHaveBeenCalledWith(10);
      expect(notificationsRepository.deleteByCarId).toHaveBeenCalledWith(10);

      // Verificar limpieza de grupos
      expect(LikesRepository.deleteGroupLikes).toHaveBeenCalledWith(50);
      expect(notificationsRepository.deleteByGroupId).toHaveBeenCalledWith(50);
      // Limpieza de imagen de grupo
      expect(uploadService.deleteImage).toHaveBeenCalledWith(expect.stringContaining('group-pic'));

      // Verificar limpieza social del usuario (La preocupación específica)
      expect(LikesRepository.deleteUserLikes).toHaveBeenCalledWith(123);
      expect(FollowsRepository.deleteUserFollows).toHaveBeenCalledWith(123);
      expect(notificationsRepository.deleteByUserId).toHaveBeenCalledWith(123);

      // Verificar limpieza de perfil de usuario
      expect(uploadService.deleteImage).toHaveBeenCalledWith(expect.stringContaining('user-pic'));
      
      // Verificar eliminación final
      expect(UserCrud.deleteUserFromUsername).toHaveBeenCalledWith('testuser');
    });
  });
});
