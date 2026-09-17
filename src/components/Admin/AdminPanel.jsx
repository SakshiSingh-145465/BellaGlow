import React, { useEffect, useMemo, useState } from "react";

import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiLogOut,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiTrash2,
  FiUsers,
  FiX,
  FiXCircle,
} from "react-icons/fi";

import { supabase } from "../../lib/supabaseClient";
import "./AdminPanel.css";

const hourlyLimit = 10;

const capacityTimeSlots = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const activeStatuses = [
  "pending",
  "confirmed",
  "completed",
];

const emptyService = {
  id: null,
  title: "",
  description: "",
  price: "",
  duration: "",
  image_url: "",
  is_active: true,
};

const fieldStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  border: "1px solid #ded4cd",
  borderRadius: "8px",
  background: "#fff",
};

const checkboxLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
};

export default function AdminPanel({ user, onLogout }) {
  // =====================================================
  // APPOINTMENTS
  // =====================================================

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // SERVICES
  // =====================================================

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [serviceError, setServiceError] = useState("");

  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [savingService, setSavingService] = useState(false);

  // =====================================================
  // PACKAGES
  // =====================================================

  const emptyPackage = {
    id: null,
    number: "",
    name: "",
    subtitle: "",
    price: "",
    description: "",
    duration_minutes: 180,
    services: [],
    image_url: "",
    is_featured: false,
    is_active: true,
  };

  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packageError, setPackageError] = useState("");
  const [packageFormOpen, setPackageFormOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [packageForm, setPackageForm] = useState({ ...emptyPackage });
  const [savingPackage, setSavingPackage] = useState(false);

  // =====================================================
  // OFFERS
  // =====================================================

  const emptyOffer = {
    id: null,
    title: "",
    discount: "",
    description: "",
    valid: "",
    image_url: "",
    is_active: true,
  };

  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offerError, setOfferError] = useState("");
  const [offerFormOpen, setOfferFormOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [offerForm, setOfferForm] = useState({ ...emptyOffer });
  const [savingOffer, setSavingOffer] = useState(false);

  // =====================================================
  // HOURLY CAPACITY
  // =====================================================

  const [capacityDate, setCapacityDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [capacityHour, setCapacityHour] = useState(
    capacityTimeSlots[0]
  );

  // =====================================================
  // LOAD APPOINTMENTS
  // =====================================================

  const loadAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", {
          ascending: true,
        })
        .order("appointment_time", {
          ascending: true,
        });

      if (fetchError) {
        throw fetchError;
      }

      setAppointments(data || []);
    } catch (err) {
      console.error("Admin appointments error:", err);

      setError(
        err?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD SERVICES
  // =====================================================

  const loadServices = async () => {
    setServicesLoading(true);
    setServiceError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("salon_services")
        .select("*")
        .order("created_at", {
          ascending: true,
        });

      if (fetchError) {
        throw fetchError;
      }

      setServices(data || []);
    } catch (err) {
      console.error("Admin services error:", err);

      setServiceError(
        err?.message ||
          "Unable to load services."
      );
    } finally {
      setServicesLoading(false);
    }
  };

  // =====================================================
  // LOAD PACKAGES
  // =====================================================

  const loadPackages = async () => {
    setPackagesLoading(true);
    setPackageError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("salon_packages")
        .select("*")
        .order("created_at", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setPackages(data || []);
    } catch (err) {
      console.error("Admin packages error:", err);
      setPackageError(err?.message || "Unable to load packages.");
    } finally {
      setPackagesLoading(false);
    }
  };

  const loadOffers = async () => {
    setOffersLoading(true);
    setOfferError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("salon_offers")
        .select("*")
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;
      setOffers(data || []);
    } catch (err) {
      console.error("Admin offers error:", err);
      setOfferError(err?.message || "Unable to load offers.");
    } finally {
      setOffersLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (user) {
      loadAppointments();
      loadServices();
      loadPackages();
      loadOffers();
    }
  }, [user]);

  // =====================================================
  // UPDATE APPOINTMENT STATUS
  // =====================================================

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setError("");

    try {
      const { error: updateError } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status,
              }
            : appointment
        )
      );
    } catch (err) {
      console.error("Status update error:", err);

      setError(
        err?.message ||
          "Unable to update appointment status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // SERVICE FORM
  // =====================================================

  const openAddService = () => {
    setEditingServiceId(null);
    setServiceForm({ ...emptyService });
    setServiceFormOpen(true);
    setServiceError("");
  };

  const openEditService = (service) => {
    setEditingServiceId(service.id);

    setServiceForm({
      id: service.id,
      title: service.title || "",
      description: service.description || "",
      price: service.price || "",
      duration: service.duration || "",
      image_url: service.image_url || "",
      is_active:
        service.is_active !== false,
    });

    setServiceFormOpen(true);
    setServiceError("");
  };

  const closeServiceForm = () => {
    if (savingService) {
      return;
    }

    setServiceFormOpen(false);
    setEditingServiceId(null);
    setServiceForm({ ...emptyService });
    setServiceError("");
  };

  const handleServiceChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setServiceForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // SAVE SERVICE
  // =====================================================

  const saveService = async (event) => {
    event.preventDefault();

    setServiceError("");

    const title = serviceForm.title.trim();
    const description =
      serviceForm.description.trim();
    const price = serviceForm.price.trim();
    const duration =
      serviceForm.duration.trim();
    const image_url =
      serviceForm.image_url.trim();

    if (!title) {
      setServiceError(
        "Please enter a service name."
      );
      return;
    }

    if (!price) {
      setServiceError(
        "Please enter the service price."
      );
      return;
    }

    setSavingService(true);

    try {
      const serviceData = {
        title,
        description,
        price,
        duration,
        image_url,
        is_active: serviceForm.is_active,
      };

      // UPDATE
      if (editingServiceId) {
        const { error: updateError } =
          await supabase
            .from("salon_services")
            .update(serviceData)
            .eq("id", editingServiceId);

        if (updateError) {
          throw updateError;
        }

        setServices(
          (previousServices) =>
            previousServices.map(
              (service) =>
                service.id ===
                editingServiceId
                  ? {
                      ...service,
                      ...serviceData,
                    }
                  : service
            )
        );
      }

      // ADD
      else {
        const { error: insertError } =
          await supabase
            .from("salon_services")
            .insert(serviceData);

        if (insertError) {
          throw insertError;
        }

        await loadServices();
      }

      setServiceFormOpen(false);
      setEditingServiceId(null);
      setServiceForm({ ...emptyService });
      setServiceError("");
    } catch (err) {
      console.error(
        "Save service error:",
        err
      );

      setServiceError(
        err?.message ||
          "Unable to save service. Please try again."
      );
    } finally {
      setSavingService(false);
    }
  };

  // =====================================================
  // DELETE SERVICE
  // =====================================================

  const deleteService = async (service) => {
    const confirmed = window.confirm(
      `Delete "${service.title}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setServiceError("");

    try {
      const { error: deleteError } =
        await supabase
          .from("salon_services")
          .delete()
          .eq("id", service.id);

      if (deleteError) {
        throw deleteError;
      }

      await loadServices();
    } catch (err) {
      console.error(
        "Delete service error:",
        err
      );

      setServiceError(
        err?.message ||
          "Unable to delete service."
      );
    }
  };

  // =====================================================
  // TOGGLE SERVICE ACTIVE
  // =====================================================

  const toggleServiceActive = async (
    service
  ) => {
    setServiceError("");

    try {
      const newValue =
        service.is_active === false;

      const { error: updateError } =
        await supabase
          .from("salon_services")
          .update({
            is_active: newValue,
          })
          .eq("id", service.id);

      if (updateError) {
        throw updateError;
      }

      await loadServices();
    } catch (err) {
      console.error(
        "Toggle service error:",
        err
      );

      setServiceError(
        err?.message ||
          "Unable to update service."
      );
    }
  };

  // =====================================================
  // PACKAGE FORM
  // =====================================================

  const openAddPackage = () => {
    setEditingPackageId(null);
    setPackageForm({ ...emptyPackage });
    setPackageFormOpen(true);
    setPackageError("");
  };

  const openEditPackage = (pkg) => {
    const servicesList = Array.isArray(pkg.services)
      ? pkg.services
      : [];

    setEditingPackageId(pkg.id);
    setPackageForm({
      id: pkg.id,
      number: pkg.number || "",
      name: pkg.name || "",
      subtitle: pkg.subtitle || "",
      price: pkg.price || "",
      description: pkg.description || "",
      duration_minutes: pkg.duration_minutes || 180,
      services: servicesList,
      image_url: pkg.image_url || "",
      is_featured: pkg.is_featured === true,
      is_active: pkg.is_active !== false,
    });
    setPackageFormOpen(true);
    setPackageError("");
  };

  const closePackageForm = () => {
    if (savingPackage) return;
    setPackageFormOpen(false);
    setEditingPackageId(null);
    setPackageForm({ ...emptyPackage });
    setPackageError("");
  };

  const handlePackageChange = (event) => {
    const { name, value, type, checked } = event.target;

    setPackageForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePackageServicesChange = (event) => {
    const services = event.target.value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    setPackageForm((previous) => ({
      ...previous,
      services,
    }));
  };

  const savePackage = async (event) => {
    event.preventDefault();
    setPackageError("");

    const number = packageForm.number.trim();
    const name = packageForm.name.trim();
    const subtitle = packageForm.subtitle.trim();
    const price = packageForm.price.trim();
    const description = packageForm.description.trim();
    const image_url = packageForm.image_url.trim();
    const duration_minutes = Number(packageForm.duration_minutes) || 180;
    const services = Array.isArray(packageForm.services)
      ? packageForm.services.filter(Boolean)
      : [];

    if (!name) {
      setPackageError("Please enter a package name.");
      return;
    }

    if (!price) {
      setPackageError("Please enter the package price.");
      return;
    }

    setSavingPackage(true);

    try {
      const packageData = {
        number,
        name,
        subtitle,
        price,
        description,
        duration_minutes,
        services,
        image_url,
        is_featured: packageForm.is_featured,
        is_active: packageForm.is_active,
      };

      if (editingPackageId) {
        const { error: updateError } = await supabase
          .from("salon_packages")
          .update(packageData)
          .eq("id", editingPackageId);

        if (updateError) throw updateError;

        setPackages((previousPackages) =>
          previousPackages.map((pkg) =>
            pkg.id === editingPackageId
              ? { ...pkg, ...packageData }
              : pkg
          )
        );
      } else {
        const { error: insertError } = await supabase
          .from("salon_packages")
          .insert(packageData);

        if (insertError) throw insertError;
        await loadPackages();
      }

      setPackageFormOpen(false);
      setEditingPackageId(null);
      setPackageForm({ ...emptyPackage });
    } catch (err) {
      console.error("Save package error:", err);
      setPackageError(
        err?.message || "Unable to save package. Please try again."
      );
    } finally {
      setSavingPackage(false);
    }
  };

  const deletePackage = async (pkg) => {
    const confirmed = window.confirm(
      `Delete "${pkg.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setPackageError("");

    try {
      const { error: deleteError } = await supabase
        .from("salon_packages")
        .delete()
        .eq("id", pkg.id);

      if (deleteError) throw deleteError;
      await loadPackages();
    } catch (err) {
      console.error("Delete package error:", err);
      setPackageError(err?.message || "Unable to delete package.");
    }
  };

  const togglePackageActive = async (pkg) => {
    setPackageError("");

    try {
      const newValue = pkg.is_active === false;

      const { error: updateError } = await supabase
        .from("salon_packages")
        .update({ is_active: newValue })
        .eq("id", pkg.id);

      if (updateError) throw updateError;
      await loadPackages();
    } catch (err) {
      console.error("Toggle package error:", err);
      setPackageError(err?.message || "Unable to update package.");
    }
  };

  // =====================================================
  // OFFER FORM
  // =====================================================

  const openAddOffer = () => {
    setEditingOfferId(null);
    setOfferForm({ ...emptyOffer });
    setOfferFormOpen(true);
    setOfferError("");
  };

  const openEditOffer = (offer) => {
    setEditingOfferId(offer.id);
    setOfferForm({
      id: offer.id,
      title: offer.title || "",
      discount: offer.discount || "",
      description: offer.description || "",
      valid: offer.valid || "",
      image_url: offer.image_url || "",
      is_active: offer.is_active !== false,
    });
    setOfferFormOpen(true);
    setOfferError("");
  };

  const closeOfferForm = () => {
    if (savingOffer) return;
    setOfferFormOpen(false);
    setEditingOfferId(null);
    setOfferForm({ ...emptyOffer });
    setOfferError("");
  };

  const handleOfferChange = (event) => {
    const { name, value, type, checked } = event.target;
    setOfferForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveOffer = async (event) => {
    event.preventDefault();
    setOfferError("");

    const title = offerForm.title.trim();
    const discount = offerForm.discount.trim();
    const description = offerForm.description.trim();
    const valid = offerForm.valid.trim();
    const image_url = offerForm.image_url.trim();

    if (!title) {
      setOfferError("Please enter an offer title.");
      return;
    }

    if (!discount) {
      setOfferError("Please enter the discount.");
      return;
    }

    setSavingOffer(true);

    try {
      const offerData = {
        title,
        discount,
        description,
        valid,
        image_url,
        is_active: offerForm.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingOfferId) {
        const { error: updateError } = await supabase
          .from("salon_offers")
          .update(offerData)
          .eq("id", editingOfferId);

        if (updateError) throw updateError;

        setOffers((previousOffers) =>
          previousOffers.map((offer) =>
            offer.id === editingOfferId
              ? { ...offer, ...offerData }
              : offer
          )
        );
      } else {
        const { error: insertError } = await supabase
          .from("salon_offers")
          .insert(offerData);

        if (insertError) throw insertError;
        await loadOffers();
      }

      setOfferFormOpen(false);
      setEditingOfferId(null);
      setOfferForm({ ...emptyOffer });
    } catch (err) {
      console.error("Save offer error:", err);
      setOfferError(err?.message || "Unable to save offer. Please try again.");
    } finally {
      setSavingOffer(false);
    }
  };

  const deleteOffer = async (offer) => {
    const confirmed = window.confirm(
      `Delete "${offer.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setOfferError("");

    try {
      const { error: deleteError } = await supabase
        .from("salon_offers")
        .delete()
        .eq("id", offer.id);

      if (deleteError) throw deleteError;
      await loadOffers();
    } catch (err) {
      console.error("Delete offer error:", err);
      setOfferError(err?.message || "Unable to delete offer.");
    }
  };

  const toggleOfferActive = async (offer) => {
    setOfferError("");

    try {
      const newValue = offer.is_active === false;

      const { error: updateError } = await supabase
        .from("salon_offers")
        .update({
          is_active: newValue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", offer.id);

      if (updateError) throw updateError;
      await loadOffers();
    } catch (err) {
      console.error("Toggle offer error:", err);
      setOfferError(err?.message || "Unable to update offer.");
    }
  };

  // =====================================================
  // STATS
  // =====================================================

  const totalAppointments =
    appointments.length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "pending"
    ).length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "confirmed"
    ).length;

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "completed"
    ).length;

  // =====================================================
  // TODAY
  // =====================================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayAppointments =
    appointments.filter(
      (appointment) =>
        appointment.appointment_date ===
        today
    );

  const todayActiveAppointments =
    todayAppointments.filter(
      (appointment) =>
        activeStatuses.includes(
          appointment.status
        )
    );

  // =====================================================
  // HOURLY BOOKINGS
  // =====================================================

  const getBookingsForHour = (
    date,
    hour
  ) => {
    return appointments.filter(
      (appointment) => {
        if (
          appointment.appointment_date !==
          date
        ) {
          return false;
        }

        if (!appointment.appointment_time) {
          return false;
        }

        const appointmentHour =
          appointment.appointment_time.slice(
            0,
            5
          );

        return (
          appointmentHour === hour &&
          activeStatuses.includes(
            appointment.status
          )
        );
      }
    ).length;
  };

  const selectedHourBookings =
    getBookingsForHour(
      capacityDate,
      capacityHour
    );

  const selectedHourAvailable =
    Math.max(
      hourlyLimit -
        selectedHourBookings,
      0
    );

  const selectedHourPercentage =
    hourlyLimit > 0
      ? Math.min(
          (selectedHourBookings /
            hourlyLimit) *
            100,
          100
        )
      : 0;

  // =====================================================
  // BUSIEST HOUR
  // =====================================================

  const hourlySummary = useMemo(() => {
    return capacityTimeSlots.map(
      (time) => ({
        time,
        bookings:
          getBookingsForHour(
            capacityDate,
            time
          ),
      })
    );
  }, [
    appointments,
    capacityDate,
  ]);

  const busiestHourData =
    hourlySummary.reduce(
      (highest, current) => {
        if (!highest) {
          return current;
        }

        return current.bookings >
          highest.bookings
          ? current
          : highest;
      },
      null
    );

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // FORMAT HOUR
  // =====================================================

  const formatHourLabel = (time) => {
    if (!time) {
      return "-";
    }

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // RETURN / UI
  // =====================================================

  return (
    <section
      className="admin-section"
      id="admin"
    >
      <div className="admin-container">

        {/* TOP BAR */}

        <div className="admin-topbar">
          <div>
            <span className="admin-label">
              BELLA GLOW ADMIN
            </span>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage your salon
              appointments, services
              and customer visits.
            </p>
          </div>

          <div className="admin-actions">

            <button
              type="button"
              className="admin-refresh"
              onClick={() => {
                loadAppointments();
                loadServices();
              }}
              disabled={
                loading ||
                servicesLoading ||
                packagesLoading ||
                offersLoading
              }
            >
              <FiRefreshCw />
              REFRESH
            </button>

            <button
              type="button"
              className="admin-logout"
              onClick={onLogout}
            >
              <FiLogOut />
              LOG OUT
            </button>

          </div>
        </div>

        {/* LOGGED IN USER */}

        <div className="admin-welcome">
          Logged in as{" "}
          <strong>
            {user?.email}
          </strong>
        </div>

        {/* STATS */}

        <div className="admin-stats">

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FiUsers />
            </div>

            <span>
              TOTAL APPOINTMENTS
            </span>

            <strong>
              {totalAppointments}
            </strong>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FiClock />
            </div>

            <span>
              PENDING
            </span>

            <strong>
              {pendingAppointments}
            </strong>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FiCalendar />
            </div>

            <span>
              CONFIRMED
            </span>

            <strong>
              {confirmedAppointments}
            </strong>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FiCheckCircle />
            </div>

            <span>
              COMPLETED
            </span>

            <strong>
              {completedAppointments}
            </strong>
          </div>

        </div>

        {/* =================================================
            CONTENT MANAGEMENT — SERVICES
        ================================================= */}

        <div className="admin-table-card">

          <div className="admin-table-header">

            <div>
              <span>
                CONTENT MANAGEMENT
              </span>

              <h2>
                Salon Services
              </h2>
            </div>

            <button
              type="button"
              className="admin-refresh"
              onClick={openAddService}
            >
              <FiPlus />
              ADD SERVICE
            </button>

          </div>

          {serviceError && (
            <div className="admin-error">
              <FiXCircle />

              <span>
                {serviceError}
              </span>
            </div>
          )}

          {servicesLoading ? (
            <div className="admin-loading">
              <FiRefreshCw />

              <span>
                Loading services...
              </span>
            </div>
          ) : services.length === 0 ? (
            <div className="admin-empty">

              <FiCalendar />

              <h3>
                No services yet
              </h3>

              <p>
                Add your first salon
                service.
              </p>

            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>SERVICE</th>
                    <th>DESCRIPTION</th>
                    <th>PRICE</th>
                    <th>DURATION</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>

                  {services.map(
                    (service) => (
                      <tr
                        key={service.id}
                      >

                        <td>
                          <div className="customer-name">
                            {service.title}
                          </div>
                        </td>

                        <td>
                          <span className="appointment-message">
                            {service.description ||
                              "—"}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {service.price ||
                              "—"}
                          </strong>
                        </td>

                        <td>
                          {service.duration ||
                            "—"}
                        </td>

                        <td>

                          <button
                            type="button"
                            className={`status-select ${
                              service.is_active
                                ? "status-confirmed"
                                : "status-cancelled"
                            }`}
                            onClick={() =>
                              toggleServiceActive(
                                service
                              )
                            }
                          >
                            {service.is_active
                              ? "ACTIVE"
                              : "HIDDEN"}
                          </button>

                        </td>

                        <td>

                          <div
                            style={{
                              display:
                                "flex",
                              gap: "8px",
                              alignItems:
                                "center",
                              flexWrap:
                                "wrap",
                            }}
                          >

                            <button
                              type="button"
                              className="admin-refresh"
                              onClick={() =>
                                openEditService(
                                  service
                                )
                              }
                            >
                              <FiEdit2 />
                              EDIT
                            </button>

                            <button
                              type="button"
                              className="admin-logout"
                              onClick={() =>
                                deleteService(
                                  service
                                )
                              }
                              title="Delete service"
                            >
                              <FiTrash2 />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* =================================================
            ADD / EDIT SERVICE
        ================================================= */}

        {serviceFormOpen && (
          <div className="admin-table-card">

            <div className="admin-table-header">

              <div>
                <span>
                  {editingServiceId
                    ? "EDIT SERVICE"
                    : "NEW SERVICE"}
                </span>

                <h2>
                  {editingServiceId
                    ? "Update Service"
                    : "Add Service"}
                </h2>
              </div>

              <button
                type="button"
                className="admin-logout"
                onClick={closeServiceForm}
                disabled={savingService}
              >
                <FiX />
                CLOSE
              </button>

            </div>

            <form
              onSubmit={saveService}
              style={{
                display: "grid",
                gap: "20px",
              }}
            >

              {/* NAME + PRICE */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "20px",
                }}
              >

                <div>

                  <label>
                    SERVICE NAME
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={
                      serviceForm.title
                    }
                    onChange={
                      handleServiceChange
                    }
                    placeholder="Hair Care"
                    required
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginTop: "8px",
                      border:
                        "1px solid #ded4cd",
                      borderRadius: "8px",
                    }}
                  />

                </div>

                <div>

                  <label>
                    PRICE
                  </label>

                  <input
                    type="text"
                    name="price"
                    value={
                      serviceForm.price
                    }
                    onChange={
                      handleServiceChange
                    }
                    placeholder="From ₹799"
                    required
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginTop: "8px",
                      border:
                        "1px solid #ded4cd",
                      borderRadius: "8px",
                    }}
                  />

                </div>

              </div>

              {/* DURATION + IMAGE */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "20px",
                }}
              >

                <div>

                  <label>
                    DURATION
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={
                      serviceForm.duration
                    }
                    onChange={
                      handleServiceChange
                    }
                    placeholder="60 MIN"
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginTop: "8px",
                      border:
                        "1px solid #ded4cd",
                      borderRadius: "8px",
                    }}
                  />

                </div>

                <div>

                  <label>
                    IMAGE URL
                  </label>

                  <input
                    type="text"
                    name="image_url"
                    value={
                      serviceForm.image_url
                    }
                    onChange={
                      handleServiceChange
                    }
                    placeholder="https://..."
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginTop: "8px",
                      border:
                        "1px solid #ded4cd",
                      borderRadius: "8px",
                    }}
                  />

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label>
                  DESCRIPTION
                </label>

                <textarea
                  name="description"
                  value={
                    serviceForm.description
                  }
                  onChange={
                    handleServiceChange
                  }
                  placeholder="Describe this beauty service..."
                  rows="5"
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "8px",
                    border:
                      "1px solid #ded4cd",
                    borderRadius: "8px",
                    resize: "vertical",
                  }}
                />

              </div>

              {/* ACTIVE */}

              <label
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >

                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    serviceForm.is_active
                  }
                  onChange={
                    handleServiceChange
                  }
                />

                <span>
                  Show this service
                  on the website
                </span>

              </label>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  gap: "12px",
                  flexWrap:
                    "wrap",
                }}
              >

                <button
                  type="button"
                  className="admin-logout"
                  onClick={
                    closeServiceForm
                  }
                  disabled={savingService}
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="admin-refresh"
                  disabled={savingService}
                >

                  {savingService ? (
                    <>
                      <FiRefreshCw />
                      SAVING...
                    </>
                  ) : (
                    <>
                      <FiSave />

                      {editingServiceId
                        ? "UPDATE SERVICE"
                        : "ADD SERVICE"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>
        )}

        {/* =================================================
            CONTENT MANAGEMENT — PACKAGES
        ================================================= */}

        <div className="admin-table-card">
          <div className="admin-table-header">
            <div>
              <span>CONTENT MANAGEMENT</span>
              <h2>Salon Packages</h2>
            </div>

            <button
              type="button"
              className="admin-refresh"
              onClick={openAddPackage}
            >
              <FiPlus />
              ADD PACKAGE
            </button>
          </div>

          {packageError && (
            <div className="admin-error">
              <FiXCircle />
              <span>{packageError}</span>
            </div>
          )}

          {packagesLoading ? (
            <div className="admin-loading">
              <FiRefreshCw />
              <span>Loading packages...</span>
            </div>
          ) : packages.length === 0 ? (
            <div className="admin-empty">
              <FiCalendar />
              <h3>No packages yet</h3>
              <p>Add your first salon package.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>NO.</th>
                    <th>PACKAGE</th>
                    <th>PRICE</th>
                    <th>DURATION</th>
                    <th>FEATURED</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td>{pkg.number || "—"}</td>
                      <td>
                        <div className="customer-name">{pkg.name}</div>
                        <span className="appointment-message">
                          {pkg.subtitle || pkg.description || "—"}
                        </span>
                      </td>
                      <td><strong>{pkg.price || "—"}</strong></td>
                      <td>{pkg.duration_minutes || 180} MIN</td>
                      <td>{pkg.is_featured ? "YES" : "NO"}</td>
                      <td>
                        <button
                          type="button"
                          className={`status-select ${
                            pkg.is_active
                              ? "status-confirmed"
                              : "status-cancelled"
                          }`}
                          onClick={() => togglePackageActive(pkg)}
                        >
                          {pkg.is_active ? "ACTIVE" : "HIDDEN"}
                        </button>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            type="button"
                            className="admin-refresh"
                            onClick={() => openEditPackage(pkg)}
                          >
                            <FiEdit2 />
                            EDIT
                          </button>

                          <button
                            type="button"
                            className="admin-logout"
                            onClick={() => deletePackage(pkg)}
                            title="Delete package"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =================================================
            ADD / EDIT PACKAGE
        ================================================= */}

        {packageFormOpen && (
          <div className="admin-table-card">
            <div className="admin-table-header">
              <div>
                <span>{editingPackageId ? "EDIT PACKAGE" : "NEW PACKAGE"}</span>
                <h2>{editingPackageId ? "Update Package" : "Add Package"}</h2>
              </div>

              <button
                type="button"
                className="admin-logout"
                onClick={closePackageForm}
                disabled={savingPackage}
              >
                <FiX />
                CLOSE
              </button>
            </div>

            <form
              onSubmit={savePackage}
              style={{ display: "grid", gap: "20px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <label>NUMBER</label>
                  <input
                    type="text"
                    name="number"
                    value={packageForm.number}
                    onChange={handlePackageChange}
                    placeholder="01"
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <label>PACKAGE NAME</label>
                  <input
                    type="text"
                    name="name"
                    value={packageForm.name}
                    onChange={handlePackageChange}
                    placeholder="Signature Glow"
                    required
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <label>PRICE</label>
                  <input
                    type="text"
                    name="price"
                    value={packageForm.price}
                    onChange={handlePackageChange}
                    placeholder="₹4,999"
                    required
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <label>SUBTITLE</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={packageForm.subtitle}
                    onChange={handlePackageChange}
                    placeholder="MOST LOVED"
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <label>DURATION (MINUTES)</label>
                  <input
                    type="number"
                    name="duration_minutes"
                    min="1"
                    value={packageForm.duration_minutes}
                    onChange={handlePackageChange}
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <label>IMAGE URL</label>
                  <input
                    type="text"
                    name="image_url"
                    value={packageForm.image_url}
                    onChange={handlePackageChange}
                    placeholder="https://..."
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div>
                <label>DESCRIPTION</label>
                <textarea
                  name="description"
                  value={packageForm.description}
                  onChange={handlePackageChange}
                  placeholder="Describe this beauty package..."
                  rows="4"
                  style={{ ...fieldStyle, resize: "vertical" }}
                />
              </div>

              <div>
                <label>SERVICES — ONE PER LINE</label>
                <textarea
                  value={packageForm.services.join("\n")}
                  onChange={handlePackageServicesChange}
                  placeholder={"Hair Cut & Styling\nPremium Facial\nManicure & Pedicure"}
                  rows="6"
                  style={{ ...fieldStyle, resize: "vertical" }}
                />
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={packageForm.is_featured}
                    onChange={handlePackageChange}
                  />
                  <span>Mark this package as featured</span>
                </label>

                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={packageForm.is_active}
                    onChange={handlePackageChange}
                  />
                  <span>Show this package on the website</span>
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="admin-logout"
                  onClick={closePackageForm}
                  disabled={savingPackage}
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="admin-refresh"
                  disabled={savingPackage}
                >
                  {savingPackage ? (
                    <>
                      <FiRefreshCw />
                      SAVING...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      {editingPackageId ? "UPDATE PACKAGE" : "ADD PACKAGE"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =================================================
            CONTENT MANAGEMENT — OFFERS
        ================================================= */}

        <div className="admin-table-card">
          <div className="admin-table-header">
            <div>
              <span>CONTENT MANAGEMENT</span>
              <h2>Special Offers</h2>
            </div>

            <button
              type="button"
              className="admin-refresh"
              onClick={openAddOffer}
            >
              <FiPlus />
              ADD OFFER
            </button>
          </div>

          {offerError && (
            <div className="admin-error">
              <FiXCircle />
              <span>{offerError}</span>
            </div>
          )}

          {offersLoading ? (
            <div className="admin-loading">
              <FiRefreshCw />
              <span>Loading offers...</span>
            </div>
          ) : offers.length === 0 ? (
            <div className="admin-empty">
              <FiCalendar />
              <h3>No offers yet</h3>
              <p>Add your first special offer.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>OFFER</th>
                    <th>DISCOUNT</th>
                    <th>DESCRIPTION</th>
                    <th>VALIDITY</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.id}>
                      <td>
                        <div className="customer-name">{offer.title}</div>
                      </td>
                      <td><strong>{offer.discount || "—"}</strong></td>
                      <td>
                        <span className="appointment-message">
                          {offer.description || "—"}
                        </span>
                      </td>
                      <td>{offer.valid || "—"}</td>
                      <td>
                        <button
                          type="button"
                          className={`status-select ${
                            offer.is_active
                              ? "status-confirmed"
                              : "status-cancelled"
                          }`}
                          onClick={() => toggleOfferActive(offer)}
                        >
                          {offer.is_active ? "ACTIVE" : "HIDDEN"}
                        </button>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            type="button"
                            className="admin-refresh"
                            onClick={() => openEditOffer(offer)}
                          >
                            <FiEdit2 />
                            EDIT
                          </button>

                          <button
                            type="button"
                            className="admin-logout"
                            onClick={() => deleteOffer(offer)}
                            title="Delete offer"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {offerFormOpen && (
          <div className="admin-table-card">
            <div className="admin-table-header">
              <div>
                <span>{editingOfferId ? "EDIT OFFER" : "NEW OFFER"}</span>
                <h2>{editingOfferId ? "Update Offer" : "Add Offer"}</h2>
              </div>

              <button
                type="button"
                className="admin-logout"
                onClick={closeOfferForm}
                disabled={savingOffer}
              >
                <FiX />
                CLOSE
              </button>
            </div>

            <form
              onSubmit={saveOffer}
              style={{ display: "grid", gap: "20px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <label>OFFER TITLE</label>
                  <input
                    type="text"
                    name="title"
                    value={offerForm.title}
                    onChange={handleOfferChange}
                    placeholder="First Glow"
                    required
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <label>DISCOUNT</label>
                  <input
                    type="text"
                    name="discount"
                    value={offerForm.discount}
                    onChange={handleOfferChange}
                    placeholder="15% OFF"
                    required
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <label>VALIDITY</label>
                  <input
                    type="text"
                    name="valid"
                    value={offerForm.valid}
                    onChange={handleOfferChange}
                    placeholder="New clients only"
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <label>IMAGE URL</label>
                  <input
                    type="text"
                    name="image_url"
                    value={offerForm.image_url}
                    onChange={handleOfferChange}
                    placeholder="https://..."
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div>
                <label>DESCRIPTION</label>
                <textarea
                  name="description"
                  value={offerForm.description}
                  onChange={handleOfferChange}
                  placeholder="Describe this special offer..."
                  rows="5"
                  style={{ ...fieldStyle, resize: "vertical" }}
                />
              </div>

              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={offerForm.is_active}
                  onChange={handleOfferChange}
                />
                <span>Show this offer on the website</span>
              </label>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="admin-logout"
                  onClick={closeOfferForm}
                  disabled={savingOffer}
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="admin-refresh"
                  disabled={savingOffer}
                >
                  {savingOffer ? (
                    <>
                      <FiRefreshCw />
                      SAVING...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      {editingOfferId ? "UPDATE OFFER" : "ADD OFFER"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =================================================
            HOURLY CAPACITY
        ================================================= */}

        <div className="admin-capacity-card">

          <div className="admin-capacity-info">

            <span className="admin-capacity-label">
              HOURLY APPOINTMENT CAPACITY
            </span>

            <h2>
              10 bookings per hour.
            </h2>

            <p>
              BellaGlow accepts a maximum
              of 10 active appointments in
              the same one-hour time slot.
            </p>

          </div>

          <div className="admin-capacity-hours">

            <div className="admin-capacity-date">

              <label
                htmlFor="capacity-date"
                className="admin-capacity-hours-label"
              >
                SELECT DATE
              </label>

              <input
                id="capacity-date"
                type="date"
                value={capacityDate}
                onChange={(event) =>
                  setCapacityDate(
                    event.target.value
                  )
                }
                className="admin-date-input"
              />

            </div>

            <div className="admin-capacity-hour">

              <label
                htmlFor="capacity-hour"
                className="admin-capacity-hours-label"
              >
                SELECT HOUR
              </label>

              <select
                id="capacity-hour"
                className="admin-hour-select"
                value={capacityHour}
                onChange={(event) =>
                  setCapacityHour(
                    event.target.value
                  )
                }
              >

                {capacityTimeSlots.map(
                  (time) => {
                    const bookings =
                      getBookingsForHour(
                        capacityDate,
                        time
                      );

                    return (
                      <option
                        key={time}
                        value={time}
                      >
                        {formatHourLabel(
                          time
                        )}{" "}
                        —{" "}
                        {bookings}/
                        {hourlyLimit} bookings
                      </option>
                    );
                  }
                )}

              </select>

            </div>

          </div>

          <div className="admin-capacity-control">

            <div className="admin-capacity-number">

              <div>

                <strong>
                  {selectedHourBookings}
                </strong>

                <span>
                  BOOKINGS IN SELECTED HOUR
                </span>

              </div>

            </div>

            <div className="admin-capacity-status">

              <div>

                <span>
                  SELECTED HOUR
                </span>

                <strong>
                  {formatHourLabel(
                    capacityHour
                  )}
                </strong>

              </div>

              <div>

                <span>
                  ACTIVE BOOKINGS
                </span>

                <strong>
                  {selectedHourBookings}/
                  {hourlyLimit}
                </strong>

              </div>

              <div>

                <span>
                  AVAILABLE
                </span>

                <strong>
                  {selectedHourAvailable}
                </strong>

              </div>

            </div>

          </div>

          <div className="admin-capacity-bar">
            <span
              style={{
                width: `${selectedHourPercentage}%`,
              }}
            ></span>
          </div>

        </div>

        {/* TODAY'S CAPACITY */}

        <div className="admin-capacity-card">

          <div className="admin-capacity-info">

            <span className="admin-capacity-label">
              TODAY'S CAPACITY
            </span>

            <h2>
              {todayActiveAppointments.length}{" "}
              active bookings today.
            </h2>

            <p>
              The busiest hour for the
              selected date is shown below.
            </p>

          </div>

          <div className="admin-capacity-status">

            <div>

              <span>
                SELECTED DATE
              </span>

              <strong>
                {formatDate(
                  capacityDate
                )}
              </strong>

            </div>

            <div>

              <span>
                BUSIEST HOUR
              </span>

              <strong>
                {busiestHourData
                  ? formatHourLabel(
                      busiestHourData.time
                    )
                  : "-"}
              </strong>

            </div>

            <div>

              <span>
                BUSIEST COUNT
              </span>

              <strong>
                {busiestHourData
                  ? `${busiestHourData.bookings}/${hourlyLimit}`
                  : `0/${hourlyLimit}`}
              </strong>

            </div>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="admin-error">

            <FiXCircle />

            <span>
              {error}
            </span>

          </div>
        )}

        {/* =================================================
            APPOINTMENTS
        ================================================= */}

        <div className="admin-table-card">

          <div className="admin-table-header">

            <div>

              <span>
                BOOKINGS
              </span>

              <h2>
                All Appointments
              </h2>

            </div>

            <span className="admin-count">
              {appointments.length} BOOKINGS
            </span>

          </div>

          {loading ? (
            <div className="admin-loading">

              <FiRefreshCw />

              <span>
                Loading appointments...
              </span>

            </div>
          ) : appointments.length === 0 ? (
            <div className="admin-empty">

              <FiCalendar />

              <h3>
                No appointments yet
              </h3>

              <p>
                Customer appointments
                will appear here.
              </p>

            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      CUSTOMER
                    </th>

                    <th>
                      SERVICE
                    </th>

                    <th>
                      DATE
                    </th>

                    <th>
                      TIME
                    </th>

                    <th>
                      CONTACT
                    </th>

                    <th>
                      MESSAGE
                    </th>

                    <th>
                      STATUS
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {appointments.map(
                    (appointment) => (

                      <tr
                        key={
                          appointment.id
                        }
                      >

                        <td>

                          <div className="customer-name">
                            {
                              appointment.name
                            }
                          </div>

                          <div className="customer-email">
                            {
                              appointment.email
                            }
                          </div>

                        </td>

                        <td>

                          <span className="service-name">
                            {
                              appointment.service_name
                            }
                          </span>

                        </td>

                        <td>
                          {formatDate(
                            appointment.appointment_date
                          )}
                        </td>

                        <td>
                          {formatTime(
                            appointment.appointment_time
                          )}
                        </td>

                        <td>
                          {
                            appointment.phone
                          }
                        </td>

                        <td>

                          <span className="appointment-message">
                            {
                              appointment.message ||
                              "—"
                            }
                          </span>

                        </td>

                        <td>

                          <select
                            className={`status-select status-${appointment.status}`}
                            value={
                              appointment.status
                            }
                            disabled={
                              updatingId ===
                              appointment.id
                            }
                            onChange={(
                              event
                            ) =>
                              updateStatus(
                                appointment.id,
                                event.target.value
                              )
                            }
                          >

                            <option value="pending">
                              Pending
                            </option>

                            <option value="confirmed">
                              Confirmed
                            </option>

                            <option value="completed">
                              Completed
                            </option>

                            <option value="cancelled">
                              Cancelled
                            </option>

                          </select>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}