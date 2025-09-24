import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  Paper,
  Box,
  TextField,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
  IconButton,
  Fade,
  Zoom
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface ContactFormData {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

const Contact: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState<ContactFormData>({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.sujet.trim()) {
      newErrors.sujet = 'Le sujet est requis';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulation d'envoi du formulaire
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset du formulaire après 3 secondes
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        nom: '',
        email: '',
        sujet: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: EmailIcon,
      title: 'Email',
      content: 'contact@prestisejour.com',
      color: 'primary.main',
      bgColor: 'primary.light',
      opacity: 0.1
    },
    {
      icon: PhoneIcon,
      title: 'Téléphone',
      content: '+225 01 02 03 04 05',
      color: 'success.main',
      bgColor: 'success.light',
      opacity: 0.1
    },
    {
      icon: LocationIcon,
      title: 'Adresse',
      content: 'Abidjan, Côte d\'Ivoire',
      color: 'error.main',
      bgColor: 'error.light',
      opacity: 0.1
    },
    {
      icon: ScheduleIcon,
      title: 'Horaires',
      content: 'Lun-Ven: 8h-18h',
      color: 'secondary.main',
      bgColor: 'secondary.light',
      opacity: 0.1
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      {/* Section Header */}
      <Fade in timeout={1000}>
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Contactez-nous
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth="4xl"
            mx="auto"
            sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, lineHeight: 1.6 }}
          >
            Nous sommes là pour vous accompagner dans votre recherche de logement idéal.
            N'hésitez pas à nous contacter pour toute question ou demande d'information.
          </Typography>
        </Box>
      </Fade>

      {/* Contact Information Cards */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        mb={8}
        sx={{ justifyContent: 'center', alignItems: 'stretch' }}
      >
        {contactInfo.map((info, index) => {
          const IconComponent = info.icon;
          return (
            <Zoom in timeout={1000 + index * 200} key={info.title}>
              <Paper
                elevation={3}
                sx={{
                  flex: 1,
                  p: 4,
                  textAlign: 'center',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                    '& .contact-icon': {
                      transform: 'scale(1.1)',
                      color: info.color
                    }
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: info.bgColor,
                    opacity: info.opacity,
                    zIndex: 0
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <IconComponent
                    className="contact-icon"
                    sx={{
                      fontSize: 48,
                      color: info.color,
                      mb: 2,
                      transition: 'all 0.3s ease-in-out'
                    }}
                  />
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600, color: 'text.primary' }}
                  >
                    {info.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {info.content}
                  </Typography>
                </Box>
              </Paper>
            </Zoom>
          );
        })}
      </Stack>

      {/* Contact Form */}
      <Box maxWidth="4xl" mx="auto">
        <Card
          elevation={4}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 4,
              textAlign: 'center'
            }}
          >
            Envoyez-nous un message
          </Typography>

          {isSubmitted && (
            <Alert
              severity="success"
              sx={{ mb: 3 }}
              icon={<CheckCircleIcon />}
            >
              Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Nom et Email */}
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
              >
                <TextField
                  fullWidth
                  label="Votre nom"
                  variant="outlined"
                  value={formData.nom}
                  onChange={handleInputChange('nom')}
                  error={!!errors.nom}
                  helperText={errors.nom}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 0 2px ${theme.palette.primary.light}40`
                      }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Votre email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 0 2px ${theme.palette.primary.light}40`
                      }
                    }
                  }}
                />
              </Stack>

              {/* Sujet */}
              <TextField
                fullWidth
                label="Sujet"
                variant="outlined"
                value={formData.sujet}
                onChange={handleInputChange('sujet')}
                error={!!errors.sujet}
                helperText={errors.sujet}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 2px ${theme.palette.primary.light}40`
                    }
                  }
                }}
              />

              {/* Message */}
              <TextField
                fullWidth
                label="Votre message"
                multiline
                rows={6}
                variant="outlined"
                value={formData.message}
                onChange={handleInputChange('message')}
                error={!!errors.message}
                helperText={errors.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 2px ${theme.palette.primary.light}40`
                    }
                  }
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
                sx={{
                  mt: 2,
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: theme.shadows[4],
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    background: theme.palette.grey[400],
                    color: theme.palette.grey[600]
                  }
                }}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </Button>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default Contact;
