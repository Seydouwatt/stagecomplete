import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Building,
} from "lucide-react";
import { toast } from "../../../stores/useToastStore";
import type { PublicArtistProfile } from "../../../types";

interface ContactTabProps {
  artistProfile: PublicArtistProfile;
}

export const ContactTab: React.FC<ContactTabProps> = ({ artistProfile }) => {
  const [contactForm, setContactForm] = useState({
    venueName: "",
    contactName: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: "",
    location: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventTypes = [
    "Concert public",
    "Événement privé",
    "Mariage",
    "Événement corporate",
    "Festival",
    "Autre",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implémenter l'envoi du formulaire
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirection vers email en attendant l'API
      const subject = `Demande de contact via StageComplete - ${artistProfile.profile.name}`;
      const body = `Bonjour,

Nom de la venue : ${contactForm.venueName}
Contact : ${contactForm.contactName}
Email : ${contactForm.email}
Téléphone : ${contactForm.phone}

Détails de l'événement :
- Date souhaitée : ${contactForm.eventDate}
- Type d'événement : ${contactForm.eventType}
- Lieu : ${contactForm.location}

Message :
${contactForm.message}

Cordialement,
${contactForm.contactName}`;

      window.location.href = `mailto:contact@stagecomplete.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      toast.success("Redirection vers votre client email...");

      // Reset form
      setContactForm({
        venueName: "",
        contactName: "",
        email: "",
        phone: "",
        eventDate: "",
        eventType: "",
        location: "",
        message: "",
      });
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setContactForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Avertissement accès restreint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="alert alert-info"
      >
        <AlertTriangle className="w-5 h-5" />
        <div>
          <h3 className="font-semibold">Contact professionnel</h3>
          <div className="text-sm">
            Cette section est réservée aux venues pour des demandes de
            prestations professionnelles.
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de contact */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-6">
              <MessageSquare className="w-5 h-5 text-primary" />
              Demande de contact
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Informations venue */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nom de la venue *</span>
                  </label>
                  <input
                    type="text"
                    name="venueName"
                    value={contactForm.venueName}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="Restaurant Le Grand..."
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Votre nom *</span>
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={contactForm.contactName}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="Prénom Nom"
                    required
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email *</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="contact@venue.com"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Téléphone</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>

              {/* Détails événement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Date souhaitée</span>
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={contactForm.eventDate}
                    onChange={handleChange}
                    className="input input-bordered"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Type d'événement</span>
                  </label>
                  <select
                    name="eventType"
                    value={contactForm.eventType}
                    onChange={handleChange}
                    className="select select-bordered"
                  >
                    <option value="">Sélectionner...</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Lieu de l'événement</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={contactForm.location}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="Ville, lieu précis..."
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-32"
                  placeholder="Décrivez votre événement, vos attentes, nombre d'invités, durée souhaitée..."
                />
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !contactForm.venueName ||
                  !contactForm.contactName ||
                  !contactForm.email
                }
                className="btn btn-primary w-full gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer la demande
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Informations de contact et disponibilités */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Contact direct */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title mb-4">
                <Phone className="w-5 h-5 text-secondary" />
                Contact direct
              </h3>
              <div className="space-y-4">
                {/* {artistProfile.profile.phone !== "" && ( */}
                <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                  <Phone className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <a
                      href={`tel:${"artistProfile.profile.phone"}`}
                      className="text-secondary hover:underline"
                    >
                      {"artistProfile.profile.phone"}
                    </a>
                  </div>
                </div>
                {/* )} */}

                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email professionnel</p>
                    <a
                      href="mailto:contact@stagecomplete.com"
                      className="text-primary hover:underline"
                    >
                      Via StageComplete
                    </a>
                  </div>
                </div>

                {artistProfile.profile.location && (
                  <div className="flex items-center gap-3 p-3 bg-info/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-info" />
                    <div>
                      <p className="font-medium">Localisation</p>
                      <p className="text-base-content/70">
                        {artistProfile.profile.location}
                      </p>
                      {artistProfile.travelRadius && (
                        <p className="text-sm text-base-content/60">
                          Rayon d'intervention : {artistProfile.travelRadius}km
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Délais de réponse */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title mb-4">
                <Clock className="w-5 h-5 text-accent" />
                Délais de réponse
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">Réponse sous 24h en moyenne</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">
                    Disponibilités mises à jour régulièrement
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">Devis personnalisé gratuit</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                <p className="text-sm text-base-content/80">
                  <strong>Conseil :</strong> Plus votre demande est détaillée,
                  plus nous pourrons vous proposer une offre adaptée rapidement.
                </p>
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="card bg-gradient-to-r from-success/10 to-info/10 border border-success/20">
            <div className="card-body">
              <h3 className="card-title mb-4">
                <User className="w-5 h-5 text-success" />À propos de ce contact
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Building className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Contact vérifié</p>
                    <p className="text-base-content/70">
                      Artiste professionnel inscrit sur StageComplete avec
                      profil vérifié
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Expérience confirmée</p>
                    <p className="text-base-content/70">
                      {artistProfile.yearsActive} années d'expérience dans le
                      domaine artistique
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Communication sécurisée</p>
                    <p className="text-base-content/70">
                      Tous les échanges sont sécurisés via la plateforme
                      StageComplete
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Instructions importantes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-base-100 shadow-lg"
      >
        <div className="card-body">
          <h3 className="card-title mb-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Informations importantes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Pour une réponse rapide</h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Précisez la date et le lieu de l'événement</li>
                <li>• Indiquez le type et la durée souhaités</li>
                <li>• Mentionnez le nombre d'invités attendus</li>
                <li>• Décrivez l'ambiance recherchée</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">Processus de réservation</h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• 1. Envoi de votre demande</li>
                <li>• 2. Réponse avec devis personnalisé</li>
                <li>• 3. Échange pour finaliser les détails</li>
                <li>• 4. Signature du contrat et acompte</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
