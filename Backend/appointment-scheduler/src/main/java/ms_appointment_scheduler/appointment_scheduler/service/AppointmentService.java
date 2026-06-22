package ms_appointment_scheduler.appointment_scheduler.service;

import ms_appointment_scheduler.appointment_scheduler.client.StockClient;
import ms_appointment_scheduler.appointment_scheduler.model.Appointment;
import ms_appointment_scheduler.appointment_scheduler.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository repository;

    @Autowired
    private StockClient stockClient;

    public Appointment createAppointment(Appointment appointment, Long productId) {
        try {
            if (productId != null) {
                stockClient.reduceStock(productId, 1);
            }

            appointment.setStatus("CONFIRMED");
            return repository.save(appointment);

        } catch (Exception e) {
            //Si falla (por falta de stock), rechazamos la cita
            appointment.setStatus("REJECTED_NO_STOCK");
            return repository.save(appointment);
        }
    }
}