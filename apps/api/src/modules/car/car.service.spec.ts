import { Test, TestingModule } from '@nestjs/testing';
import { CarService } from './car.service';
import { UploadService } from '../../services/upload.service';
import { EventsService } from '../social/events/events.service';
import { NotificationsRepository } from '../social/notifications/notifications.repository';
import * as CarCrud from 'src/database/crud/car.crud';
import * as GroupCrud from 'src/database/crud/group.crud';
import * as UserCrud from 'src/database/crud/user.crud';
import * as LikesRepository from '../social/likes/likes.repository';
import { CreateCarDTO, CarUpdateDTO } from '../../dto/car.dto';

// Mockear Dependencias
jest.mock('src/database/crud/car.crud');
jest.mock('src/database/crud/group.crud');
jest.mock('src/database/crud/user.crud');
jest.mock('../social/likes/likes.repository');

describe('CarService', () => {
  let service: CarService;
  let uploadService: UploadService;
  let eventsService: EventsService;
  let notificationsRepository: NotificationsRepository;

  const mockUploadService = {
    deleteImage: jest.fn().mockResolvedValue(true),
  };

  const mockEventsService = {
    emitCarAdded: jest.fn(),
    emitMilestoneReached: jest.fn(),
    emitWishlistItemAchieved: jest.fn(),
  };

  const mockNotificationsRepository = {
    deleteByCarId: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        { provide: UploadService, useValue: mockUploadService },
        { provide: EventsService, useValue: mockEventsService },
        { provide: NotificationsRepository, useValue: mockNotificationsRepository },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    uploadService = module.get<UploadService>(UploadService);
    eventsService = module.get<EventsService>(EventsService);
    notificationsRepository = module.get<NotificationsRepository>(NotificationsRepository);

    jest.clearAllMocks();
  });

  const mockUserToken = {
    username: 'testuser',
    userId: 123,
    email: 'test@example.com',
    iat: 123,
    exp: 123
  };

  const mockUserDB = {
    userId: 123,
    username: 'testuser',
    email: 'test@example.com'
  };

  describe('createCarService', () => {
    it('should create a car, save pictures, and emit social event', async () => {
      // Datos
      const carData: CreateCarDTO = {
        name: 'New Car',
        brand: 'Brand',
        pictures: ['http://url1.com/wheels-house/pic1.jpg', 'http://url2.com/wheels-house/pic2.jpg'],
        color: 'Red',
        scale: '1:64',
        manufacturer: 'Hot Wheels',
        condition: 'Mint',
        wished: false,
        country: 'USA'
      } as any;

      // Mocks
      jest.spyOn(UserCrud, 'getUserFromUsername').mockResolvedValue(mockUserDB as any);
      const createdCar = { carId: 99, name: 'New Car' };
      jest.spyOn(CarCrud, 'createCar').mockResolvedValue(createdCar as any);
      jest.spyOn(CarCrud, 'createCarPicture').mockResolvedValue({ carPictureId: 1 } as any);
      jest.spyOn(CarCrud, 'getCarsFromUserId').mockResolvedValue([]); // Para chequeo de hitos (0 autos)

      // Execute
      const result = await service.createCarService(carData, mockUserToken);

      // Verify
      expect(result).toBe(99);
      expect(CarCrud.createCar).toHaveBeenCalled();
      expect(CarCrud.createCarPicture).toHaveBeenCalledTimes(2); // 2 fotos
      
      // Verificar evento social
      expect(eventsService.emitCarAdded).toHaveBeenCalledWith({
        userId: 123,
        carId: 99,
        carName: 'New Car',
        carImage: 'http://url1.com/wheels-house/pic1.jpg',
        isFromWishlist: false
      });
    });
  });

  describe('updateCarService', () => {
    it('should update car details and handle picture removal correctly', async () => {
      // Estado existente
      const carId = 99;
      const existingPics = [
        { carPictureId: 10, url: 'http://keep-me.com/wheels-house/keep-me.jpg', order: 0 },
        { carPictureId: 11, url: 'http://delete-me.com/wheels-house/delete-me.jpg', order: 1 }
      ];
      
      // DTO de actualización (Usuario mantuvo foto existente, eliminó la segunda, agregó una nueva)
      const updates: CarUpdateDTO = {
        name: 'Updated Name',
        pictures: ['http://keep-me.com/wheels-house/keep-me.jpg', 'http://new-one.com/wheels-house/new.jpg']
      } as any;

      // Mocks
      jest.spyOn(CarCrud, 'updateCar').mockResolvedValue(true as any);
      jest.spyOn(CarCrud, 'getPicturesFromCar').mockResolvedValue(existingPics as any);
      
      // Mockear actualizar/crear/eliminar fotos
      jest.spyOn(CarCrud, 'updateCarPicture').mockResolvedValue(true as any);
      jest.spyOn(CarCrud, 'createCarPicture').mockResolvedValue(true as any);
      
      // Mockear eliminación de la foto que fue removida de la lista
      // Lógica en el servicio:
      // longitud del array es la misma (2 vs 2).
      // Bucle 0: keep-me == keep-me -> continuar.
      // Bucle 1: delete-me != new-one -> updateCarPicture(new-one) Y deleteImage(delete-me).
     
      // Execute
      const result = await service.updateCarService(updates, carId);

      // Verify
      expect(result).toBe(true);
      expect(CarCrud.updateCar).toHaveBeenCalledWith(updates, carId);
      
      // Validación de lógica de imágenes:
      // Índice 1 cambió de 'delete-me' a 'new-one'.
      // Debería haber llamado updateCarPicture para el índice 1.
      expect(CarCrud.updateCarPicture).toHaveBeenCalled();
      
      // Y debería haber eliminado 'delete-me' de Cloudinary
      expect(uploadService.deleteImage).toHaveBeenCalledWith(expect.stringContaining('delete-me'));
    });
  });

  describe('deleteCarService', () => {
    it('should delete car and cleanup all dependencies', async () => {
      const carId = 55;

      // Mocks
      jest.spyOn(LikesRepository, 'deleteCarLikes').mockResolvedValue(true as any);
      jest.spyOn(NotificationsRepository.prototype, 'deleteByCarId').mockResolvedValue(true as any); 
      
      jest.spyOn(GroupCrud, 'deleteGroupedCarsFromCarId').mockResolvedValue(true as any);
      jest.spyOn(CarCrud, 'deleteFeedEventsFromCarId').mockResolvedValue(true as any);
      jest.spyOn(CarCrud, 'deleteCar').mockResolvedValue({ carId } as any);
      
      jest.spyOn(CarCrud, 'deleteAllCarPictures').mockResolvedValue([
        { url: 'http://pic1.com/wheels-house/pic1.jpg' }, { url: 'http://pic2.com/wheels-house/pic2.jpg' }
      ] as any);

      const result = await service.deleteCarService(carId);

      expect(result).toBe(true);
      expect(notificationsRepository.deleteByCarId).toHaveBeenCalledWith(carId);
      expect(GroupCrud.deleteGroupedCarsFromCarId).toHaveBeenCalledWith(carId);
      expect(CarCrud.deleteCar).toHaveBeenCalledWith(carId);
      
      // Verificar limpieza de imágenes
      expect(uploadService.deleteImage).toHaveBeenCalledTimes(2);
      expect(uploadService.deleteImage).toHaveBeenCalledWith(expect.stringContaining('pic1'));
    });
  });
});
