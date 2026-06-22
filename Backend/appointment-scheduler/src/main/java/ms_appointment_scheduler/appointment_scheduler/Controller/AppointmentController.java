package ms_appointment_scheduler.appointment_scheduler.Controller;

import ms_appointment_scheduler.appointment_scheduler.model.Appointment;
import ms_appointment_scheduler.appointment_scheduler.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ms_appointment_scheduler.appointment_scheduler.dto.AppointmentRequestDTO;
import ms_appointment_scheduler.appointment_scheduler.dto.AppointmentResponseDTO;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService service;

    @PostMapping("/create")
    public AppointmentResponseDTO book(@RequestBody AppointmentRequestDTO request, @RequestParam(required = false) Long productId) {
        Appointment appointment = new Appointment();
        appointment.setCustomerUsername(request.getCustomerUsername());
        appointment.setServiceType(request.getServiceType());
        appointment.setVehicleBrand(request.getVehicleBrand());
        appointment.setVehicleModel(request.getVehicleModel());
        appointment.setVehiclePlate(request.getVehiclePlate());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setNotes(request.getNotes());
        
        Appointment savedAppointment = service.createAppointment(appointment, productId);
        return convertToDTO(savedAppointment);
    }
    
    private AppointmentResponseDTO convertToDTO(Appointment appointment) {
        return new AppointmentResponseDTO(
                appointment.getId(),
                appointment.getCustomerUsername(),
                appointment.getServiceType(),
                appointment.getVehicleBrand(),
                appointment.getVehicleModel(),
                appointment.getVehiclePlate(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getNotes(),
                appointment.getStatus()
        );
    }
}