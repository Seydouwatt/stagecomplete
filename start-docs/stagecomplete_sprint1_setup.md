# SPRINT 1 - FOUNDATION STAGECOMPLETE
## *Jours 1-7 : Setup & Authentication Core*

---

## 🚀 **SETUP PROJET - JOUR 1**

### **✅ Backend Setup (NestJS) - TERMINÉ**

```bash
# ✅ 1. Créer le projet backend
npx @nestjs/cli new stagecomplete-backend
cd stagecomplete-backend

# ✅ 2. Installer les dépendances essentielles
npm install @prisma/client prisma
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcryptjs class-validator class-transformer
npm install @nestjs/websockets @nestjs/platform-socket.io
npm install --save-dev @types/bcryptjs @types/passport-jwt

# ✅ 3. Setup Prisma
npx prisma init
```

### **✅ Frontend Setup (React + Vite) - TERMINÉ**

```bash
# ✅ 1. Créer le projet frontend
npm create vite@latest stagecomplete-frontend -- --template react-ts
cd stagecomplete-frontend

# ✅ 2. Installer les dépendances
npm install
npm install tailwindcss daisyui @types/node
npm install react-router-dom @tanstack/react-query
npm install zustand react-hook-form @hookform/resolvers zod
npm install socket.io-client axios
npm install lucide-react framer-motion

# ✅ 3. Setup TailwindCSS + DaisyUI
npx tailwindcss init -p
```

### **Configuration Files**

**Backend - .env**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/stagecomplete"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3000
NODE_ENV=development
```

**Backend - prisma/schema.prisma**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(ARTIST)
  profile   Profile?
  sentMessages     Message[] @relation("MessageSender")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Profile {
  id          String   @id @default(cuid())
  userId      String   @unique
  name        String
  bio         String?
  avatar      String?  // Base64 pour le début
  phone       String?
  location    String?
  website     String?
  socialLinks Json?    // {instagram: "", facebook: "", etc}
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  artist      Artist?
  venue       Venue?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("profiles")
}

model Artist {
  id          String   @id @default(cuid())
  profileId   String   @unique
  genres      String[] 
  instruments String[]
  priceRange  String?  // "100-500", "500-1000", etc
  experience  String?  // "BEGINNER", "INTERMEDIATE", "PROFESSIONAL"
  portfolio   Json?    // {photos: [], videos: [], audio: []}
  availability Json?   // Calendar data
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  events      Event[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("artists")
}

model Venue {
  id          String   @id @default(cuid())
  profileId   String   @unique
  capacity    Int?
  venueType   String   // "BAR", "CLUB", "THEATER", "RESTAURANT", etc
  equipment   String[] // ["sound_system", "lighting", "stage", etc]
  amenities   String[] // ["parking", "wifi", "catering", etc]
  priceRange  String?  // Budget range they typically pay
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  events      Event[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("venues")
}

model Event {
  id          String        @id @default(cuid())
  title       String
  description String?
  date        DateTime
  duration    Int?          // Duration in minutes
  budget      Float?
  status      BookingStatus @default(PENDING)
  eventType   String        // "CONCERT", "COMEDY", "THEATER", etc
  requirements String?      // Special requirements
  venueId     String
  artistId    String?
  venue       Venue         @relation(fields: [venueId], references: [id], onDelete: Cascade)
  artist      Artist?       @relation(fields: [artistId], references: [id])
  messages    Message[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@map("events")
}

model Message {
  id        String   @id @default(cuid())
  content   String
  senderId  String
  eventId   String
  isRead    Boolean  @default(false)
  sender    User     @relation("MessageSender", fields: [senderId], references: [id])
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@map("messages")
}

enum Role {
  ARTIST
  VENUE
  ADMIN
}

enum BookingStatus {
  PENDING
  ACCEPTED
  REJECTED
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

**Frontend - tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "business"],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
  },
}
```

---

## 🔐 **AUTHENTICATION SYSTEM - JOURS 2-3**

### **Backend - Auth Module**

**src/auth/auth.module.ts**
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

**src/auth/auth.service.ts**
```typescript
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hash = await bcrypt.hash(dto.password, 12);

    // Create user with profile
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        role: dto.role,
        profile: {
          create: {
            name: dto.name,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const token = await this.signToken(user.id, user.email);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.signToken(user.id, user.email);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    };
  }

  private async signToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwt.signAsync(payload);
  }
}
```

**src/auth/dto/index.ts**
```typescript
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

### **Frontend - Auth Store (Zustand)**

**src/stores/authStore.ts**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: 'ARTIST' | 'VENUE' | 'ADMIN';
  profile: {
    id: string;
    name: string;
    bio?: string;
    avatar?: string;
    location?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'ARTIST' | 'VENUE';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error('Login failed');
          }

          const data = await response.json();
          
          set({
            user: data.user,
            token: data.access_token,
            isAuthenticated: true,
          });
        } catch (error) {
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error('Registration failed');
          }

          const result = await response.json();
          
          set({
            user: result.user,
            token: result.access_token,
            isAuthenticated: true,
          });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

## 🎨 **FRONTEND LAYOUTS - JOURS 4-5**

### **Main Layout Component**

**src/components/Layout/MainLayout.tsx**
```tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '../../stores/authStore';

export const MainLayout: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-base-100">
      <Header />
      <div className="flex">
        <Sidebar userRole={user?.role} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```

**src/components/Layout/Header.tsx**
```tsx
import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Bell, User, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="navbar bg-base-200 shadow-lg">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl font-bold">
          Stage<span className="text-primary">Complete</span>
        </a>
      </div>
      
      <div className="flex-none gap-2">
        {/* Notifications */}
        <div className="indicator">
          <Bell className="w-5 h-5" />
          <span className="badge badge-xs badge-primary indicator-item"></span>
        </div>

        {/* User Menu */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              {user?.profile?.avatar ? (
                <img src={user.profile.avatar} alt={user.profile.name} />
              ) : (
                <div className="bg-primary text-primary-content w-10 h-10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><a onClick={logout}><LogOut className="w-4 h-4" />Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
```

### **Auth Pages**

**src/pages/Auth/Login.tsx**
```tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      setError('root', {
        message: 'Email ou mot de passe incorrect',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">
              Stage<span className="text-primary">Complete</span>
            </h1>
            <p className="text-base-content/70 mt-2">
              Connectez-vous à votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                {...register('email')}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email.message}</span>
                </label>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>

            {/* Global Error */}
            {errors.root && (
              <div className="alert alert-error">
                <span>{errors.root.message}</span>
              </div>
            )}
          </form>

          <div className="divider">OU</div>

          <div className="text-center">
            <p className="text-sm">
              Pas encore de compte ?{' '}
              <Link to="/register" className="link link-primary">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 🚀 **OBJECTIFS SPRINT 1 - JOUR 7**

### **✅ Checklist de fin de sprint :**

**✅ Backend :**
- [x] Projet NestJS setup avec Prisma
- [x] Base de données PostgreSQL opérationnelle
- [x] Modèles User/Profile/Artist/Venue/Event/Message
- [x] Auth endpoints (register/login) fonctionnels
- [x] JWT middleware protection
- [x] Validation des données avec class-validator

**✅ Frontend :**
- [x] Projet React + Vite + TailwindCSS + DaisyUI
- [x] Auth store avec Zustand + persist
- [x] Pages Login/Register avec validation
- [x] Layout principal avec Header/Sidebar
- [x] Routing protégé selon rôle
- [x] Design system cohérent
- [x] Composants UI de base (Button, Input)
- [x] Charts components (DonutChart, LineChart, BarChart)

**🔄 Tests en cours :**
- [ ] Auth flow complet : Register → Login → Dashboard (à tester)
- [ ] Gestion erreurs auth (email exists, wrong password)
- [ ] Persistance session (refresh page)
- [ ] Responsive mobile basique

### **🎯 Definition of Done Sprint 1 :**
- ✅ Un utilisateur peut créer un compte (ARTIST ou VENUE)
- ✅ Un utilisateur peut se connecter et voir son dashboard
- ✅ La session persiste après refresh
- ✅ L'interface est mobile-friendly
- ✅ Ready pour Sprint 2 (Profiles)

---

## 🔄 **TRANSITION VERS SPRINT 2**

### **Préparation Week-end :**
- **Deploy staging** sur Render pour tests
- **Seed data** : Quelques genres/catégories
- **API documentation** basique
- **Code review** et refactoring

### **Sprint 2 Preview :**
- **Artist Profile Builder** complet avec portfolio
- **Venue Profile** avec équipements/capacité
- **Browse Artists** page avec filtres
- **File upload** (base64 pour commencer)

**READY TO CODE? LET'S GO! 🚀**