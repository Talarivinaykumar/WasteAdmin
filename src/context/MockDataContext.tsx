import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../utils/api';
import { io, Socket } from 'socket.io-client';

// Types (Keep existing types)
export interface User {
    _id: string;
    id?: string; // for compatibility
    name: string;
    email: string;
    role: 'admin' | 'buyer' | 'seller' | 'both';
    status: 'active' | 'blocked';
    joinDate: string;
    verificationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
    documents?: { type: string; url: string; status: 'pending' | 'approved' | 'rejected' }[];
    verified?: boolean;
}

export interface Product {
    _id: string;
    id?: string;
    title: string;
    description: string;
    category: any;
    subCategory: any;
    price: number;
    location: string;
    sellerId: any;
    status: 'pending' | 'approved' | 'rejected' | 'blocked';
    createdAt: string;
}

export interface Category {
    _id: string;
    id?: string;
    name: string;
    type: 'main' | 'sub';
    parentId?: string;
    status: 'active' | 'inactive';
}

export interface Advertisement {
    id: string;
    _id?: string;
    title: string;
    imageUrl: string;
    linkUrl?: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'inactive';
    position: 'home_banner' | 'sidebar' | 'listing_page';
}

export interface SpecField {
    id?: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'date';
    options?: string[];
    required: boolean;
}

export interface SpecificationTemplate {
    _id?: string;
    subCategoryId: string;
    fields: SpecField[];
}

export interface Order {
    _id: string;
    listingId: any;
    buyerId: any;
    sellerId: any;
    amount: number;
    status: string;
    createdAt: string;
}

export interface Notification {
    _id: string;
    id?: string;
    title: string;
    message: string;
    target: 'all' | 'buyers' | 'sellers' | 'specific';
    date: string;
    status: 'sent' | 'scheduled';
}

export interface State {
    _id: string;
    id?: string;
    name: string;
    country: string;
    status: 'active' | 'inactive';
}

export interface City {
    _id: string;
    id?: string;
    name: string;
    stateId: string;
    status: 'active' | 'inactive';
}

export interface Log {
    _id: string;
    action: string;
    user: string;
    details: string;
    date: string;
    type: 'activity' | 'approval';
}

interface DashboardStats {
    totalUsers: number;
    totalSellers: number;
    totalProducts: number;
    pendingApprovals: number;
    liveListings: number;
    blockedListings: number;
    totalRevenue: number;
}

interface MockDataContextType {
    users: User[];
    products: Product[];
    categories: Category[];
    specificationTemplates: SpecificationTemplate[];
    stats: DashboardStats;
    orders: Order[];
    reports: any[];
    notifications: Notification[];
    states: State[];
    cities: City[];
    logs: Log[];
    ads: any[];
    banners: any[];
    loading: boolean;
    // Actions
    fetchData: () => Promise<void>;
    updateUserStatus: (id: string, status: 'active' | 'blocked') => Promise<void>;
    updateProductStatus: (id: string, status: Product['status']) => Promise<void>;
    addProduct: (product: Partial<Product>) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    bulkApproveProducts: (productIds: string[]) => Promise<void>;
    addCategory: (category: Partial<Category>) => Promise<void>;
    updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    saveSpecificationTemplate: (template: SpecificationTemplate) => Promise<void>;
    updateSellerVerification: (userId: string, status: User['verificationStatus'], rejectionReason?: string) => Promise<void>;
    addAd: (ad: any) => Promise<void>;
    updateAd: (id: string, ad: any) => Promise<void>;
    deleteAd: (id: string) => Promise<void>;
    createBanner: (banner: any) => Promise<void>;
    updateBanner: (id: string, banner: any) => Promise<void>;
    deleteBanner: (id: string) => Promise<void>;
    sendNotification: (notification: Partial<Notification>) => Promise<void>;
    addState: (state: Partial<State>) => Promise<void>;
    deleteState: (id: string) => Promise<void>;
    addCity: (city: Partial<City>) => Promise<void>;
    deleteCity: (id: string) => Promise<void>;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MockDataProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [specificationTemplates, setSpecificationTemplates] = useState<SpecificationTemplate[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);
    const [ads, setAds] = useState<any[]>([]);
    const [banners, setBanners] = useState<any[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalSellers: 0,
        totalProducts: 0,
        pendingApprovals: 0,
        liveListings: 0,
        blockedListings: 0,
        totalRevenue: 0
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [uRes, pRes, aRes, cRes, sRes, stRes, ciRes, bRes, nRes, oRes, rRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/products'), // All products (User Listings)
                api.get('/admin/ads'),      // Ad Campaigns
                api.get('/categories'),
                api.get('/admin/stats'),
                api.get('/locations/states'),
                api.get('/locations/cities'),
                api.get('/admin/banners'),
                api.get('/admin/notifications'),
                api.get('/orders'),
                api.get('/admin/reports'), 
            ]);

            const mapWithId = (arr: any[]) => {
                if (!Array.isArray(arr)) return [];
                const seen = new Set();
                return arr
                    .filter(item => {
                        // Ensure item exists and has a valid ID field
                        if (!item) return false;
                        const potentialId = item._id || item.id;
                        if (!potentialId) return false;
                        return true;
                    })
                    .map(item => {
                        // Convert ID to a stable string
                        const rawId = item._id || item.id;
                        const id = typeof rawId === 'object' && rawId.toString ? rawId.toString() : String(rawId);
                        return { ...item, id };
                    })
                    .filter(item => {
                        // Final pass: ensure uniqueness across the set
                        if (seen.has(item.id)) return false;
                        seen.add(item.id);
                        return true;
                    });
            };

            setUsers(mapWithId(uRes.data.data || []));
            setProducts(mapWithId(pRes.data.data || []));
            setAds(mapWithId(aRes.data.data || []));
            setCategories(mapWithId(cRes.data.data || []));
            setStats(sRes.data.data || {});
            setStates(mapWithId(stRes.data.data || []));
            setCities(mapWithId(ciRes.data.data || []));
            setBanners(mapWithId(bRes.data.data || []));
            setNotifications(mapWithId(nRes.data.data || []));
            setOrders(mapWithId(oRes.data.data || []));
            setReports(mapWithId(rRes.data.data || []));
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Socket.io for real-time updates
        const socket = io('http://localhost:5000');
        socket.on('newKYC', () => fetchData());
        socket.on('newProduct', () => fetchData());
        socket.on('newOrder', () => fetchData());
        socket.on('broadcastNotification', () => fetchData());

        return () => {
            socket.disconnect();
        };
    }, []);

    const updateUserStatus = async (id: string, status: 'active' | 'blocked') => {
        await api.put(`/users/${id}/status`, { status });
        fetchData();
    };

    const updateProductStatus = async (id: string, status: string) => {
        try {
            console.log('Updating product status:', id, status);
            await api.put(`/products/${id}/review`, { status });
            fetchData();
        } catch (error) {
            console.error('Error updating product status:', error);
        }
    };

    const addProduct = async (product: Partial<Product>) => {
        try {
            await api.post('/admin/products', product);
            fetchData();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            await api.put(`/admin/products/${id}`, updates);
            fetchData();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            console.log('MockDataContext: Deleting product with ID:', id);
            if (!id) throw new Error('Product ID is required for deletion');
            
            const response = await api.delete(`/admin/products/${id}`);
            console.log('MockDataContext: Delete response:', response.data);
            
            if (response.data.success) {
                alert('Product deleted successfully');
                await fetchData();
            } else {
                throw new Error(response.data.message || 'Failed to delete product');
            }
        } catch (error: any) {
            console.error('MockDataContext: Error deleting product:', error);
            const message = error.response?.data?.message || error.message;
            alert(`Error deleting product: ${message}`);
        }
    };

    const bulkApproveProducts = async (productIds: string[]) => {
        try {
            await api.post('/products/bulk-approve', { productIds });
            fetchData();
        } catch (error) {
            console.error('Error bulk approving products:', error);
        }
    };

    const addCategory = async (category: Partial<Category>) => {
        await api.post('/categories', category);
        fetchData();
    };

    const updateCategory = async (id: string, updates: Partial<Category>) => {
        await api.put(`/categories/${id}`, updates);
        fetchData();
    };

    const deleteCategory = async (id: string) => {
        await api.delete(`/categories/${id}`);
        fetchData();
    };

    const saveSpecificationTemplate = async (template: SpecificationTemplate) => {
        await api.post('/categories/spec-template', template);
        fetchData();
    };

    const updateSellerVerification = async (userId: string, status: User['verificationStatus'], rejectionReason?: string) => {
        await api.put(`/users/${userId}/kyc-review`, { status, reason: rejectionReason });
        fetchData();
    };

    const addAd = async (ad: any) => {
        await api.post('/admin/ads', ad);
        fetchData();
    };

    const updateAd = async (id: string, ad: any) => {
        await api.put(`/admin/ads/${id}`, ad);
        fetchData();
    };

    const deleteAd = async (id: string) => {
        await api.delete(`/admin/ads/${id}`);
        fetchData();
    };

    const createBanner = async (banner: any) => {
        await api.post('/admin/banners', banner);
        fetchData();
    };

    const updateBanner = async (id: string, banner: any) => {
        await api.put(`/admin/banners/${id}`, banner);
        fetchData();
    };

    const deleteBanner = async (id: string) => {
        await api.delete(`/admin/banners/${id}`);
        fetchData();
    };

    const sendNotification = async (notification: Partial<Notification>) => {
        await api.post('/admin/notifications', notification);
        fetchData();
    };

    const addState = async (state: Partial<State>) => {
        await api.post('/locations/states', state);
        fetchData();
    };

    const deleteState = async (id: string) => {
        await api.delete(`/locations/states/${id}`);
        fetchData();
    };

    const addCity = async (city: Partial<City>) => {
        await api.post('/locations/cities', city);
        fetchData();
    };

    const deleteCity = async (id: string) => {
        await api.delete(`/locations/cities/${id}`);
        fetchData();
    };

    return (
        <MockDataContext.Provider value={{
            users, products, categories, specificationTemplates, reports, notifications, states, cities, logs, ads, stats, orders, loading,
            banners,
            fetchData, updateUserStatus, updateProductStatus, addProduct, updateProduct, deleteProduct, bulkApproveProducts, addCategory,
            updateCategory, deleteCategory, saveSpecificationTemplate, updateSellerVerification,
            addAd, updateAd, deleteAd,
            createBanner, updateBanner, deleteBanner,
            sendNotification, addState, deleteState, addCity, deleteCity
        }}>
            {children}
        </MockDataContext.Provider>
    );
};

export const useMockData = () => {
    const context = useContext(MockDataContext);
    if (context === undefined) {
        throw new Error('useMockData must be used within a MockDataProvider');
    }
    return context;
};
