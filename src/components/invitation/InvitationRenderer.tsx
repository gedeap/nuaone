'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  MailOpen,
  Volume2,
  VolumeX,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Heart,
  Send,
  Sparkles,
  QrCode,
  Download,
  X,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';

interface InvitationRendererProps {
  invitation: any;
  guest?: any | null;
  guestToken?: string | null;
  isPublicPreview?: boolean;
}

export function InvitationRenderer({
  invitation,
  guest,
  guestToken,
  isPublicPreview = false,
}: InvitationRendererProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showQrisModal, setShowQrisModal] = useState<string | null>(null);

  // RSVP Form States
  const [attendance, setAttendance] = useState<'ATTENDING' | 'DECLINED'>('ATTENDING');
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [guestRsvp, setGuestRsvp] = useState(guest?.rsvp || null);

  // Guestbook States
  const [guestbookMessages, setGuestbookMessages] = useState<any[]>(
    invitation.guestbookMessages || []
  );
  const [gbSenderName, setGbSenderName] = useState(guest?.name || '');
  const [gbMessage, setGbMessage] = useState('');
  const [gbSubmitting, setGbSubmitting] = useState(false);

  // Copy States
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(invitation.weddingDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [invitation.weddingDate]);

  // Audio Handler
  const handleOpenInvitation = () => {
    setIsOpen(true);

    // Confetti celebration effect
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D8C3A5', '#B59E7B', '#FFFFFF'],
    });

    // Play music if configured
    if (audioRef.current && invitation.musicUrl) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log('Autoplay blocked:', e));
    }

    // Smooth scroll down to content
    setTimeout(() => {
      document.getElementById('invitation-content')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleCopyAccount = (accNumber: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedAccount(accNumber);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestToken) {
      alert('Fitur RSVP hanya tersedia bagi tamu yang membuka melalui tautan personal.');
      return;
    }

    setRsvpSubmitting(true);
    try {
      const res = await fetch(`/api/invitations/${invitation.slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: guestToken,
          attendanceStatus: attendance,
          attendeeCount: attendance === 'ATTENDING' ? attendeeCount : 0,
          message: rsvpMessage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRsvpSuccess(true);
        setGuestRsvp(data.rsvp);
        if (rsvpMessage.trim()) {
          setGuestbookMessages([
            {
              id: Date.now().toString(),
              senderName: guest.name,
              message: rsvpMessage.trim(),
              createdAt: new Date(),
            },
            ...guestbookMessages,
          ]);
        }
      } else {
        alert(data.error || 'Gagal mengirim konfirmasi kehadiran.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gbMessage.trim()) return;

    setGbSubmitting(true);
    try {
      const res = await fetch(`/api/invitations/${invitation.slug}/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: guestToken,
          senderName: gbSenderName,
          message: gbMessage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setGuestbookMessages([data.message, ...guestbookMessages]);
        setGbMessage('');
      } else {
        alert(data.error || 'Gagal mengirim ucapan.');
      }
    } catch {
      alert('Gagal mengirim ucapan.');
    } finally {
      setGbSubmitting(false);
    }
  };

  const guestDisplayName = guest?.name || (isPublicPreview ? 'Tamu Undangan Terhormat' : 'Bapak/Ibu/Saudara/i');
  const loveStoryList: any[] = invitation.story ? JSON.parse(invitation.story) : [];

  return (
    <div className="relative min-h-screen bg-[#F8F5F0] text-[#252525] selection:bg-[#D8C3A5] font-sans overflow-x-hidden">
      {/* Background Audio Stream */}
      {invitation.musicUrl && (
        <audio ref={audioRef} src={invitation.musicUrl} loop preload="auto" />
      )}

      {/* Floating Audio Controller */}
      {isOpen && invitation.musicUrl && (
        <button
          onClick={toggleMusic}
          aria-label="Toggle musik latar"
          className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full bg-[#252525]/85 backdrop-blur-md text-[#D8C3A5] border border-[#D8C3A5]/40 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 animate-pulse text-[#D8C3A5]" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
        </button>
      )}

      {/* 1. OPENING COVER SECTION */}
      <section className="relative min-h-screen flex items-center justify-center text-center p-6 overflow-hidden">
        {/* Cover Background */}
        <div className="absolute inset-0 bg-[#252525]">
          <Image
            src={invitation.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80'}
            alt="Wedding Cover"
            fill
            priority
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#252525] via-[#252525]/50 to-[#252525]/80" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto space-y-6 text-[#F8F5F0] animate-fade-in py-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold tracking-widest uppercase text-[#D8C3A5]">
            The Wedding Invitation
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-wide text-white">
              {invitation.brideNickname} & {invitation.groomNickname}
            </h1>
            <p className="font-serif italic text-sm sm:text-base text-[#D8C3A5]">
              {new Date(invitation.weddingDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Recipient Card */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2 max-w-sm mx-auto shadow-2xl">
            <span className="text-[10px] uppercase tracking-widest text-[#E9E1D6]/70 block">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              {guestDisplayName}
            </h3>
            {guest?.category && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#D8C3A5] text-[#252525]">
                {guest.category}
              </span>
            )}
            <p className="text-[10px] text-[#E9E1D6]/70 italic pt-1">
              *Mohon maaf apabila ada kesalahan penulisan nama atau gelar
            </p>
          </div>

          <div>
            <button
              onClick={handleOpenInvitation}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#D8C3A5] text-[#252525] text-xs font-bold tracking-widest uppercase hover:bg-white hover:scale-105 transition-all shadow-xl animate-pulse-subtle"
            >
              <MailOpen className="w-4 h-4" />
              <span>BUKA UNDANGAN</span>
            </button>
          </div>
        </div>
      </section>

      {/* MAIN INVITATION CONTENT (Revealed or Scrolled into) */}
      <div id="invitation-content" className="space-y-24 sm:space-y-32 pb-24">
        {/* 2. HOLY QUOTE / AYAT SUCI */}
        <section className="pt-20 sm:pt-28 px-6 text-center max-w-3xl mx-auto space-y-6">
          <div className="w-10 h-10 rounded-full bg-[#D8C3A5]/30 flex items-center justify-center mx-auto text-[#B59E7B]">
            <Heart className="w-5 h-5 fill-current" />
          </div>

          {invitation.quote && (
            <p className="font-serif italic text-base sm:text-lg text-[#252525]/85 leading-relaxed">
              &ldquo;{invitation.quote}&rdquo;
            </p>
          )}

          {invitation.quoteSource && (
            <span className="text-xs font-bold tracking-widest uppercase text-[#B59E7B] block">
              — {invitation.quoteSource} —
            </span>
          )}
        </section>

        {/* 3. COUPLE PROFILES */}
        <section className="px-6 max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Kedua Mempelai
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252525]">
              Maha Suci Allah yang Telah Menciptakan Makhluk-Nya Berpasang-pasangan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Mempelai Wanita */}
            <div className="p-8 rounded-3xl bg-white border border-[#E9E1D6] shadow-sm text-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto relative border-4 border-[#D8C3A5] shadow-md">
                <Image
                  src={invitation.coverImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80'}
                  alt={invitation.brideName}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#252525]">
                {invitation.brideName}
              </h3>
              <p className="text-xs text-[#252525]/70 leading-relaxed">
                {invitation.brideParents}
              </p>
              {invitation.brideInstagram && (
                <a
                  href={`https://instagram.com/${invitation.brideInstagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#B59E7B] font-semibold hover:underline"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>@{invitation.brideInstagram}</span>
                </a>
              )}
            </div>

            {/* Mempelai Pria */}
            <div className="p-8 rounded-3xl bg-white border border-[#E9E1D6] shadow-sm text-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto relative border-4 border-[#D8C3A5] shadow-md">
                <Image
                  src={invitation.closingImage || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80'}
                  alt={invitation.groomName}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#252525]">
                {invitation.groomName}
              </h3>
              <p className="text-xs text-[#252525]/70 leading-relaxed">
                {invitation.groomParents}
              </p>
              {invitation.groomInstagram && (
                <a
                  href={`https://instagram.com/${invitation.groomInstagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#B59E7B] font-semibold hover:underline"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>@{invitation.groomInstagram}</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* 4. COUNTDOWN TIMER */}
        <section className="px-6 max-w-4xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#252525] text-[#F8F5F0] text-center space-y-8 shadow-xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#D8C3A5]">
              Menghitung Hari Bahagia
            </span>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md">
                <span className="font-serif text-2xl sm:text-4xl font-bold text-white block">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#D8C3A5]">Hari</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md">
                <span className="font-serif text-2xl sm:text-4xl font-bold text-white block">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#D8C3A5]">Jam</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md">
                <span className="font-serif text-2xl sm:text-4xl font-bold text-white block">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#D8C3A5]">Menit</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md">
                <span className="font-serif text-2xl sm:text-4xl font-bold text-white block">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#D8C3A5]">Detik</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Pernikahan ${invitation.brideNickname} & ${invitation.groomNickname}`)}&dates=${new Date(invitation.weddingDate).toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(new Date(invitation.weddingDate).getTime() + 4*3600000).toISOString().replace(/-|:|\.\d\d\d/g, "")}&location=${encodeURIComponent(invitation.primaryLocation)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D8C3A5] text-[#252525] text-xs font-bold tracking-wider hover:bg-white transition-all shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>SIMPAN KE GOOGLE CALENDAR</span>
              </a>
              <a
                href={`/api/invitations/${invitation.slug}/calendar`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>UNDUH FILE ICS</span>
              </a>
            </div>
          </div>
        </section>

        {/* 5. EVENT DETAILS & MAPS */}
        <section className="px-6 max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Waktu & Lokasi Acara
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252525]">
              Rangkaian Acara Pernikahan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {invitation.events?.map((evt: any) => (
              <div
                key={evt.id}
                className="p-8 rounded-3xl bg-white border border-[#E9E1D6] shadow-sm space-y-6 text-center flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="inline-block px-4 py-1 rounded-full bg-[#F8F5F0] border border-[#D8C3A5] text-xs font-bold uppercase tracking-wider text-[#B59E7B]">
                    {evt.title}
                  </div>

                  <div className="space-y-1">
                    <p className="font-serif text-xl font-bold text-[#252525]">
                      {new Date(evt.eventDate).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs font-semibold text-[#B59E7B]">
                      Pukul {evt.startTime} — {evt.endTime || 'Selesai'}
                    </p>
                  </div>

                  <div className="pt-2 space-y-1 text-xs text-[#252525]/75">
                    <p className="font-bold text-sm text-[#252525]">{evt.venueName}</p>
                    <p className="leading-relaxed">{evt.address}</p>
                  </div>
                </div>

                {evt.googleMapsUrl && (
                  <div className="pt-4 border-t border-[#E9E1D6]">
                    <a
                      href={evt.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-semibold tracking-wider hover:bg-[#3F3F3F] transition-all shadow-sm"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#D8C3A5]" />
                      <span>BUKA GOOGLE MAPS</span>
                      <ExternalLink className="w-3 h-3 text-[#E9E1D6]/50" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 6. LOVE STORY TIMELINE */}
        {loveStoryList.length > 0 && (
          <section className="px-6 max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
                Kisah Kasih
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252525]">
                Perjalanan Cinta Kami
              </h2>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-[#D8C3A5]/60">
              {loveStoryList.map((story, i) => (
                <div
                  key={i}
                  className={`relative flex items-center justify-between md:justify-normal gap-8 ${
                    i % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="w-full md:w-1/2 p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#B59E7B] text-white text-[10px] font-bold uppercase tracking-wider">
                      {story.year}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#252525]">
                      {story.title}
                    </h4>
                    <p className="text-xs text-[#252525]/70 leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. PHOTO GALLERY */}
        {invitation.galleries?.length > 0 && (
          <section className="px-6 max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
                Galeri Momen Indah
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252525]">
                Potret Kebahagiaan Kami
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {invitation.galleries.map((img: any) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxImage(img.imageUrl)}
                  className="aspect-square rounded-2xl overflow-hidden relative cursor-pointer group bg-gray-100 border border-[#E9E1D6]"
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.caption || 'Wedding Photo'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Sparkles className="w-6 h-6 text-[#D8C3A5]" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
              <img
                src={lightboxImage}
                alt="Enlarged photo"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        )}

        {/* 8. RSVP FORM (Bound to Secure Guest Token) */}
        <section className="px-6 max-w-2xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E9E1D6] shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
                Konfirmasi Kehadiran
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252525]">
                Reservasi Tempat (RSVP)
              </h2>
              <p className="text-xs text-[#252525]/60 max-w-md mx-auto">
                Membantu kami dan keluarga dalam mempersiapkan susunan acara dan jamuan dengan baik.
              </p>
            </div>

            {guestRsvp ? (
              <div className="p-6 rounded-2xl bg-[#F8F5F0] border border-[#D8C3A5] text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-base text-[#252525]">
                  Konfirmasi Anda Telah Tercatat
                </h4>
                <p className="text-xs text-[#252525]/70">
                  Status:{' '}
                  <strong className="text-[#252525]">
                    {guestRsvp.attendanceStatus === 'ATTENDING'
                      ? `Akan Hadir (${guestRsvp.attendeeCount} orang)`
                      : 'Berhalangan Hadir'}
                  </strong>
                </p>
                <button
                  type="button"
                  onClick={() => setGuestRsvp(null)}
                  className="text-[11px] text-[#B59E7B] font-semibold underline pt-2"
                >
                  Ubah Tanggapan RSVP
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                    Nama Tamu Terundang
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={guestDisplayName}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0] font-semibold text-[#252525]"
                  />
                  <span className="text-[10px] text-[#252525]/50 block mt-1">
                    *Nama terverifikasi otomatis dari tautan undangan khusus Anda
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-2">
                    Konfirmasi Kehadiran Anda
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttendance('ATTENDING')}
                      className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all ${
                        attendance === 'ATTENDING'
                          ? 'border-[#252525] bg-[#252525] text-white shadow-sm'
                          : 'border-[#D8C3A5] bg-[#F8F5F0] text-[#252525] hover:bg-[#E9E1D6]'
                      }`}
                    >
                      ✓ Ya, Akan Hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendance('DECLINED')}
                      className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all ${
                        attendance === 'DECLINED'
                          ? 'border-red-600 bg-red-600 text-white shadow-sm'
                          : 'border-[#D8C3A5] bg-[#F8F5F0] text-[#252525] hover:bg-[#E9E1D6]'
                      }`}
                    >
                      ✕ Berhalangan Hadir
                    </button>
                  </div>
                </div>

                {attendance === 'ATTENDING' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                      Jumlah Kehadiran (Maksimal {guest?.maxAttendees || 2} Orang)
                    </label>
                    <select
                      value={attendeeCount}
                      onChange={(e) => setAttendeeCount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
                    >
                      {[...Array(guest?.maxAttendees || 2)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Orang
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#252525]/70 mb-1">
                    Doa & Ucapan untuk Mempelai
                  </label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Tuliskan ucapan selamat dan doa restu Anda..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={rsvpSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-bold tracking-widest uppercase hover:bg-[#3F3F3F] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-[#D8C3A5]" />
                  <span>{rsvpSubmitting ? 'MENGIRIM...' : 'KIRIM KONFIRMASI (RSVP)'}</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 9. DIGITAL ENVELOPE (TANDA KASIH) */}
        {invitation.gifts?.length > 0 && (
          <section className="px-6 max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
                Tanda Kasih
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252525]">
                Amplop Digital
              </h2>
              <p className="text-xs text-[#252525]/70 max-w-md mx-auto leading-relaxed">
                Doa restu Anda merupakan kado terindah bagi kami. Namun jika Anda hendak memberikan tanda kasih secara digital, Anda dapat menggunakan rekening di bawah ini:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {invitation.gifts.map((g: any) => {
                const isCopied = copiedAccount === g.accountNumber;

                return (
                  <div
                    key={g.id}
                    className="p-6 rounded-3xl bg-white border border-[#E9E1D6] shadow-sm space-y-4 text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#F8F5F0] border border-[#D8C3A5] flex items-center justify-center mx-auto font-serif font-bold text-sm text-[#252525]">
                      {g.providerName}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#B59E7B] block">
                        {g.notes || 'Transfer Bank'}
                      </span>
                      <code className="text-base font-mono font-bold text-[#252525] block mt-1">
                        {g.accountNumber}
                      </code>
                      <span className="text-xs text-[#252525]/70 block mt-0.5">
                        A/N: {g.accountName}
                      </span>
                    </div>

                    <div className="pt-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleCopyAccount(g.accountNumber)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D8C3A5] text-xs font-semibold text-[#252525] hover:bg-[#F8F5F0] transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#B59E7B]" />
                            <span>Salin No. Rekening</span>
                          </>
                        )}
                      </button>

                      {g.qrisImageUrl && (
                        <button
                          onClick={() => setShowQrisModal(g.qrisImageUrl)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-semibold hover:bg-[#3F3F3F]"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#D8C3A5]" />
                          <span>QRIS</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* QRIS Modal */}
        {showQrisModal && (
          <div
            onClick={() => setShowQrisModal(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 sm:p-8 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => setShowQrisModal(null)}
                className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
              <h4 className="font-serif text-lg font-bold text-[#252525]">
                Scan QRIS Pembayaran
              </h4>
              <p className="text-[11px] text-[#252525]/60">
                Mendukung BCA Mobile, Mandiri Livin, GoPay, OVO, DANA, ShopeePay, dan semua aplikasi perbankan.
              </p>
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative border border-[#E9E1D6]">
                <img
                  src={showQrisModal}
                  alt="QRIS Code"
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <a
                href={showQrisModal}
                download="QRIS-Wedding.png"
                target="_blank"
                className="w-full py-2.5 rounded-full bg-[#252525] text-[#F8F5F0] text-xs font-bold tracking-wider inline-flex items-center justify-center gap-2 hover:bg-[#3F3F3F]"
              >
                <Download className="w-4 h-4 text-[#D8C3A5]" />
                <span>UNDUH GAMBAR QRIS</span>
              </a>
            </div>
          </div>
        )}

        {/* 10. DIGITAL GUESTBOOK */}
        <section className="px-6 max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B59E7B]">
              Buku Tamu Digital
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252525]">
              Untaian Doa & Ucapan Selamat
            </h2>
          </div>

          {/* New message form */}
          <div className="p-6 rounded-2xl bg-white border border-[#E9E1D6] shadow-sm space-y-4">
            <form onSubmit={handleGuestbookSubmit} className="space-y-3">
              <input
                type="text"
                required
                value={gbSenderName}
                onChange={(e) => setGbSenderName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
              />
              <textarea
                rows={3}
                required
                value={gbMessage}
                onChange={(e) => setGbMessage(e.target.value)}
                placeholder="Kirimkan doa restu untuk kedua mempelai..."
                className="w-full px-4 py-2 rounded-xl border border-[#D8C3A5] text-xs bg-[#F8F5F0]"
              ></textarea>
              <button
                type="submit"
                disabled={gbSubmitting}
                className="px-6 py-2 rounded-full bg-[#252525] text-white text-xs font-bold tracking-wider hover:bg-[#3F3F3F] disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#D8C3A5]" />
                <span>{gbSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}</span>
              </button>
            </form>
          </div>

          {/* Messages List */}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {guestbookMessages.map((msg: any) => (
              <div
                key={msg.id}
                className="p-5 rounded-2xl bg-white border border-[#E9E1D6] shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#252525]">
                    {msg.senderName}
                  </h4>
                  <span className="text-[10px] text-[#252525]/40">
                    {new Date(msg.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-xs text-[#252525]/75 leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 11. CLOSING SECTION */}
        <section className="px-6 text-center max-w-2xl mx-auto space-y-6 pt-12">
          {invitation.closingImage && (
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto relative border-4 border-[#D8C3A5] shadow-xl">
              <Image
                src={invitation.closingImage}
                alt="Closing Portrait"
                fill
                className="object-cover"
              />
            </div>
          )}

          <p className="text-xs sm:text-sm text-[#252525]/80 leading-relaxed italic">
            &ldquo;{invitation.closingMessage || 'Merupakan kehormatan bagi kami atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian.'}&rdquo;
          </p>

          <div className="space-y-1">
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#252525]">
              {invitation.brideNickname} & {invitation.groomNickname}
            </h3>
            {invitation.weddingHashtag && (
              <span className="text-xs font-bold tracking-widest text-[#B59E7B] uppercase block">
                {invitation.weddingHashtag}
              </span>
            )}
          </div>

          <div className="pt-8 border-t border-[#E9E1D6]/80 text-[11px] text-[#252525]/50 space-y-1">
            <p>Undangan Digital Eksklusif dipersembahkan oleh</p>
            <a
              href="https://nuaone.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif font-bold text-xs text-[#252525] hover:text-[#B59E7B] tracking-wider uppercase inline-block"
            >
              Nuaone Studio (nuaone.my.id)
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
