export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'admin' | 'manager' | 'staff' | 'customer';
    phone_number: string;
    address: string;
    is_staff: boolean;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | null;
    created_at: string;
    updated_at: string;
    labs: Lab[];
    quantity?: number;
}

export interface Lab {
    id: number;
    title: string;
    description: string;
    content: string;
    product: Product;
    status: 'draft' | 'published' | 'archived';
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    customer: User;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total_amount: number;
    shipping_address: string;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    order: Order;
    product: Product;
    quantity: number;
    price: number;
    labs_activated: boolean;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface SupportTicket {
    id: number;
    customer: User;
    staff: User | null;
    lab: Lab;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    created_at: string;
    updated_at: string;
    messages: SupportMessage[];
}

export interface SupportMessage {
    id: number;
    ticket: SupportTicket;
    sender: User;
    message: string;
    created_at: string;
} 