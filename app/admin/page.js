'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  Save, 
  Search, 
  Tag, 
  Shield, 
  MessageSquare, 
  Phone, 
  Inbox, 
  RefreshCw,
  Download,
  FileSpreadsheet
} from 'lucide-react';

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [authError, setAuthError] = useState('');
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'inquiries', or 'gst'
  const [gstBills, setGstBills] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Quotation states
  const [quotations, setQuotations] = useState([]);
  const [isQuotationFormOpen, setIsQuotationFormOpen] = useState(false);
  const [editingQuotationId, setEditingQuotationId] = useState(null);
  const [quotationSearchQuery, setQuotationSearchQuery] = useState('');
  const [isQuotationPreview, setIsQuotationPreview] = useState(false);
  const [quotationFormData, setQuotationFormData] = useState({
    quotationNo: '',
    customerName: '',
    phone: '',
    email: '',
    address: '',
    gstNo: '',
    date: '',
    validityDays: 1,
    items: [{ name: '', qty: 1, unit: 'Pcs', rate: 0, total: 0 }],
    cgst: 0,
    sgst: 0,
    igst: 0,
    loadingCharges: 0,
    transportCharges: 0,
    subtotal: 0,
    totalTax: 0,
    totalAmount: 0,
    terms: `1. Prices are valid for 1 day.\n2. 30% advance payment, balance before delivery.\n3. Loading & transportation charges extra as applicable.\n4. Goods once sold will not be returned.\n5. All disputes subject to Patna jurisdiction.\n6. Rates are including GST.`
  });
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('');

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states for Add / Edit Products
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null for "Add", id for "Edit"
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'MS Pipes',
    description: '',
    price: 'On Request',
    imageUrl: '',
    specifications: [{ key: 'Thickness', value: '' }],
    isActive: true,
  });

  const [uploading, setUploading] = useState(false);
  const [smtpTestLoading, setSmtpTestLoading] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Max size allowed is 5MB.");
      return;
    }

    setUploading(true);
    const uData = new FormData();
    uData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-admin-password': passcode,
        },
        body: uData,
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
      } else {
        alert(result.error || 'Failed to upload image.');
      }
    } catch (err) {
      alert('A network error occurred during image upload.');
    } finally {
      setUploading(false);
    }
  };

  // Local storage check for passcode
  useEffect(() => {
    const savedPass = sessionStorage.getItem('admin_pass');
    if (savedPass) {
      verifyPasscode(savedPass);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyPasscode = async (passToVerify) => {
    setLoading(true);
    setAuthError('');
    try {
      const response = await fetch('/api/products', {
        headers: {
          'x-admin-password': passToVerify,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsAuth(true);
        setProducts(result.data);
        sessionStorage.setItem('admin_pass', passToVerify);
        setPasscode(passToVerify);
        // Fetch inquiries as well
        fetchInquiries(passToVerify);
        fetchGstBills(passToVerify);
        fetchNotifications(passToVerify);
        fetchQuotations(passToVerify);
      } else {
        setAuthError(result.error || 'Authentication failed.');
        sessionStorage.removeItem('admin_pass');
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!passcode) return;
    verifyPasscode(passcode);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_pass');
    setIsAuth(false);
    setProducts([]);
    setInquiries([]);
    setQuotations([]);
    setPasscode('');
  };

  // Quotation Management Handlers
  const fetchQuotations = async (pass = passcode) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/quotations', {
        headers: {
          'x-admin-password': pass,
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setQuotations(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch quotations', err);
    } finally {
      setActionLoading(false);
    }
  };

  const generateQuotationNo = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `Q-${dateStr}-${rand}`;
  };

  const openCreateQuotation = () => {
    setEditingQuotationId(null);
    setIsQuotationPreview(false);
    setQuotationFormData({
      quotationNo: generateQuotationNo(),
      customerName: '',
      phone: '',
      email: '',
      address: '',
      gstNo: '',
      date: new Date().toISOString().slice(0, 10),
      validityDays: 1,
      items: [{ name: '', qty: 1, unit: 'Pcs', rate: 0, total: 0 }],
      cgst: 0,
      sgst: 0,
      igst: 0,
      loadingCharges: 0,
      transportCharges: 0,
      subtotal: 0,
      totalTax: 0,
      totalAmount: 0,
      terms: `1. Prices are valid for 1 day.\n2. 30% advance payment, balance before delivery.\n3. Loading & transportation charges extra as applicable.\n4. Goods once sold will not be returned.\n5. All disputes subject to Patna jurisdiction.\n6. Rates are including GST.`
    });
    setIsQuotationFormOpen(true);
  };

  const openEditQuotation = (quote) => {
    setEditingQuotationId(quote._id);
    setIsQuotationPreview(false);
    setQuotationFormData({
      quotationNo: quote.quotationNo,
      customerName: quote.customerName,
      phone: quote.phone,
      email: quote.email || '',
      address: quote.address || '',
      gstNo: quote.gstNo || '',
      date: new Date(quote.date).toISOString().slice(0, 10),
      validityDays: quote.validityDays || 1,
      items: quote.items.map(item => ({
        name: item.name,
        qty: item.qty,
        unit: item.unit || 'Pcs',
        rate: item.rate,
        total: item.total
      })),
      cgst: quote.cgst || 0,
      sgst: quote.sgst || 0,
      igst: quote.igst || 0,
      loadingCharges: quote.loadingCharges || 0,
      transportCharges: quote.transportCharges || 0,
      subtotal: quote.subtotal,
      totalTax: quote.totalTax,
      totalAmount: quote.totalAmount,
      terms: quote.terms || ''
    });
    setIsQuotationFormOpen(true);
  };

  const handleQuotationFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = editingQuotationId ? `/api/quotations/${editingQuotationId}` : '/api/quotations';
    const method = editingQuotationId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': passcode,
        },
        body: JSON.stringify(quotationFormData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsQuotationFormOpen(false);
        setEditingQuotationId(null);
        fetchQuotations();
      } else {
        alert(result.error || 'Failed to save quotation.');
      }
    } catch (err) {
      alert('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuotation = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this quotation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/quotations/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': passcode,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        fetchQuotations();
      } else {
        alert(result.error || 'Failed to delete quotation.');
      }
    } catch (err) {
      alert('A network error occurred.');
    }
  };

  // Quotation Item Operations
  const addQuotationItemRow = () => {
    setQuotationFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', qty: 1, unit: 'Pcs', rate: 0, total: 0 }]
    }));
  };

  const removeQuotationItemRow = (index) => {
    if (quotationFormData.items.length === 1) return;
    setQuotationFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleQuotationItemChange = (index, field, value) => {
    const updatedItems = [...quotationFormData.items];
    updatedItems[index][field] = field === 'qty' || field === 'rate' ? Number(value) : value;
    updatedItems[index].total = updatedItems[index].qty * updatedItems[index].rate;
    setQuotationFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const handleProductSelect = (index, prodId) => {
    const prod = products.find(p => p._id === prodId);
    if (!prod) return;

    const updatedItems = [...quotationFormData.items];
    const specText = prod.specifications && prod.specifications.length > 0
      ? prod.specifications.map(s => `${s.key}: ${s.value}`).join(', ')
      : '';
    const brandText = prod.brand ? ` (${prod.brand}${specText ? `, ${specText}` : ''})` : (specText ? ` (${specText})` : '');
    updatedItems[index].name = `${prod.name}${brandText}`;
    
    let estRate = 0;
    if (prod.price && prod.price !== 'On Request') {
      const match = prod.price.match(/\d+[\d,.]*/);
      if (match) {
        estRate = parseFloat(match[0].replace(/,/g, ''));
      }
    }
    updatedItems[index].rate = estRate;
    updatedItems[index].total = estRate * updatedItems[index].qty;

    setQuotationFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  // Calculations useEffect
  useEffect(() => {
    if (!isQuotationFormOpen) return;
    
    const updatedItems = quotationFormData.items.map(item => {
      const total = Number(item.qty || 0) * Number(item.rate || 0);
      return { ...item, total };
    });

    const subtotal = updatedItems.reduce((acc, item) => acc + item.total, 0);

    const cgstPct = 0;
    const sgstPct = 0;
    const igstPct = 0;

    const totalTax = 0;

    const loading = Number(quotationFormData.loadingCharges || 0);
    const transport = Number(quotationFormData.transportCharges || 0);

    const totalAmount = Math.round(subtotal + loading + transport);

    if (
      JSON.stringify(updatedItems) !== JSON.stringify(quotationFormData.items) ||
      subtotal !== quotationFormData.subtotal ||
      totalTax !== quotationFormData.totalTax ||
      totalAmount !== quotationFormData.totalAmount
    ) {
      setQuotationFormData(prev => ({
        ...prev,
        items: updatedItems,
        subtotal,
        totalTax,
        totalAmount
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isQuotationFormOpen,
    quotationFormData.items,
    quotationFormData.loadingCharges,
    quotationFormData.transportCharges
  ]);

  // PDF Export logic
  const handleDownloadQuotationPdf = async (quote) => {
    try {
      let logoBase64 = null;
      try {
        const logoRes = await fetch('/images/logo.jpg');
        const logoBlob = await logoRes.blob();
        logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(logoBlob);
        });
      } catch (err) {
        console.error('Failed to load logo for PDF', err);
      }

      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4'); // A4 size: 210 x 297 mm

      const leftMargin = 15;
      const rightMargin = 195;
      let currentY = 15;

      // Draw Letterhead Header
      if (logoBase64) {
        doc.addImage(logoBase64, 'JPEG', leftMargin, currentY, 22, 22);
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('UJJWAL IRON', 42, currentY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text('Dealers in MS Pipes, MS Angles, MS Flats, GP Pipes & Roofing Sheets', 42, currentY + 11);
      doc.text('Address: Lalmati Devi House, Ashiyana Digha Road, Digha Ghat, Patna - 800011', 42, currentY + 16);
      doc.text('Mobile: +91 8986043632 | Email: sales@ujjwaliron.com', 42, currentY + 21);

      currentY += 26;
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.setLineWidth(0.5);
      doc.line(leftMargin, currentY, rightMargin, currentY);

      // Title
      currentY += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(217, 119, 6); // amber-600
      doc.text('QUOTATION', 105, currentY, { align: 'center' });

      // Customer Info Box vs Quotation Info
      currentY += 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('QUOTATION TO:', leftMargin, currentY);
      doc.text('QUOTATION DETAILS:', 125, currentY);

      currentY += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(quote.customerName, leftMargin, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85); // slate-700
      doc.text(`Quotation No: ${quote.quotationNo}`, 125, currentY);

      currentY += 5;
      doc.text(`Phone: +91 ${quote.phone}`, leftMargin, currentY);
      doc.text(`Date: ${new Date(quote.date).toLocaleDateString('en-IN')}`, 125, currentY);

      currentY += 5;
      doc.text(`Validity: ${quote.validityDays} Day(s)`, 125, currentY);
      if (quote.gstNo) {
        doc.text(`GSTIN: ${quote.gstNo.toUpperCase()}`, leftMargin, currentY);
        currentY += 5;
      }
      if (quote.address) {
        doc.text(`Delivery: ${quote.address}`, leftMargin, currentY);
        currentY += 5;
      }

      currentY += 5;

      // Draw Items Table Headers
      doc.setFillColor(241, 245, 249); // slate-100 background
      doc.rect(leftMargin, currentY, 180, 8, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42); // slate-900

      // columns: S.No, Description, Qty, Unit, Rate, Total
      doc.text('S.No', leftMargin + 2, currentY + 5.5);
      doc.text('Material Description', leftMargin + 12, currentY + 5.5);
      doc.text('Qty', leftMargin + 131, currentY + 5.5, { align: 'right' });
      doc.text('Unit', leftMargin + 133, currentY + 5.5);
      doc.text('Rate', leftMargin + 163, currentY + 5.5, { align: 'right' });
      doc.text('Total (Rs)', rightMargin - 1, currentY + 5.5, { align: 'right' });

      currentY += 8;

      // Table Rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85); // slate-700
      
      quote.items.forEach((item, index) => {
        if (currentY > 240) {
          doc.addPage();
          currentY = 20;
          
          doc.setFillColor(241, 245, 249);
          doc.rect(leftMargin, currentY, 180, 8, 'F');
          doc.setFont('helvetica', 'bold');
          doc.text('S.No', leftMargin + 2, currentY + 5.5);
          doc.text('Material Description', leftMargin + 12, currentY + 5.5);
          doc.text('Qty', leftMargin + 131, currentY + 5.5, { align: 'right' });
          doc.text('Unit', leftMargin + 133, currentY + 5.5);
          doc.text('Rate', leftMargin + 163, currentY + 5.5, { align: 'right' });
          doc.text('Total (Rs)', rightMargin - 1, currentY + 5.5, { align: 'right' });
          currentY += 8;
          doc.setFont('helvetica', 'normal');
        }

        doc.text(String(index + 1), leftMargin + 2, currentY + 5.5);
        
        const itemName = item.name.length > 60 ? item.name.substring(0, 58) + '...' : item.name;
        doc.text(itemName, leftMargin + 12, currentY + 5.5);
        
        doc.text(String(item.qty), leftMargin + 131, currentY + 5.5, { align: 'right' });
        doc.text(item.unit || 'Pcs', leftMargin + 133, currentY + 5.5);
        doc.text(item.rate.toFixed(2), leftMargin + 163, currentY + 5.5, { align: 'right' });
        doc.text((item.qty * item.rate).toFixed(2), rightMargin - 1, currentY + 5.5, { align: 'right' });

        doc.setDrawColor(241, 245, 249);
        doc.line(leftMargin, currentY + 8, rightMargin, currentY + 8);

        currentY += 8;
      });

      currentY += 5;

      if (currentY > 220) {
        doc.addPage();
        currentY = 20;
      }

      const summaryStartX = 120;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);

      // Subtotal
      doc.text('Subtotal:', summaryStartX, currentY);
      doc.text(`Rs. ${quote.subtotal.toFixed(2)}`, rightMargin - 1, currentY, { align: 'right' });
      currentY += 5;

      // Loading / Transportation
      if (quote.loadingCharges > 0) {
        doc.text('Loading Charges:', summaryStartX, currentY);
        doc.text(`Rs. ${quote.loadingCharges.toFixed(2)}`, rightMargin - 1, currentY, { align: 'right' });
        currentY += 5;
      }
      if (quote.transportCharges > 0) {
        doc.text('Transportation:', summaryStartX, currentY);
        doc.text(`Rs. ${quote.transportCharges.toFixed(2)}`, rightMargin - 1, currentY, { align: 'right' });
        currentY += 5;
      }

      doc.setDrawColor(203, 213, 225);
      doc.line(summaryStartX, currentY, rightMargin - 1, currentY);
      currentY += 4;

      // Grand Total
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('Grand Total:', summaryStartX, currentY);
      doc.text(`Rs. ${Math.round(quote.totalAmount).toLocaleString('en-IN')}`, rightMargin - 1, currentY, { align: 'right' });

      currentY += 15;

      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      // Terms
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('Terms & Conditions:', leftMargin, currentY);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // slate-500
      
      const termsLines = quote.terms ? quote.terms.split('\n') : [];
      let termsY = currentY + 4;
      termsLines.forEach((line) => {
        doc.text(line, leftMargin, termsY);
        termsY += 4;
      });

      // Signature box
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('For UJJWAL IRON', 150, currentY);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Authorized Signatory', 150, currentY + 18);

      const filename = `${quote.quotationNo}_${quote.customerName.replace(/\s+/g, '_')}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Check console logs.');
    }
  };

  const handleTestSmtp = async () => {
    setSmtpTestLoading(true);
    setSmtpTestResult(null);
    try {
      const res = await fetch('/api/admin/test-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': passcode,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSmtpTestResult({ success: true, message: data.message });
      } else {
        setSmtpTestResult({ success: false, error: data.error || 'Failed to dispatch test email.' });
      }
    } catch (err) {
      setSmtpTestResult({ success: false, error: 'Network communication error.' });
    } finally {
      setSmtpTestLoading(false);
    }
  };

  const fetchProducts = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/products', {
        headers: {
          'x-admin-password': passcode,
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setProducts(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchInquiries = async (pass = passcode) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/inquiries', {
        headers: {
          'x-admin-password': pass,
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setInquiries(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchGstBills = async (pass = passcode) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/ca/bills', {
        headers: {
          'x-admin-password': pass,
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setGstBills(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch GST bills', err);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchNotifications = async (pass = passcode) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        headers: {
          'x-admin-password': pass,
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setNotifications(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const clearNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications/read', {
        method: 'POST',
        headers: {
          'x-admin-password': passcode,
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchNotifications(passcode);
      }
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  // Product Specification handlers
  const addSpecField = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }));
  };

  const removeSpecField = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: updatedSpecs }));
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      brand: '',
      category: 'MS Pipes',
      description: '',
      price: 'On Request',
      imageUrl: '',
      specifications: [
        { key: 'Thickness', value: '' },
        { key: 'Length', value: '6 Meters' }
      ],
      isActive: true,
    });
    setIsFormOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingId(prod._id);
    setFormData({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      description: prod.description || '',
      price: prod.price || 'On Request',
      imageUrl: prod.imageUrl || '',
      specifications: prod.specifications && prod.specifications.length > 0 
        ? prod.specifications.map(s => ({ key: s.key, value: s.value }))
        : [{ key: '', value: '' }],
      isActive: prod.isActive,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanSpecs = formData.specifications.filter(s => s.key.trim() && s.value.trim());
    const payload = {
      ...formData,
      specifications: cleanSpecs,
    };

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': passcode,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsFormOpen(false);
        fetchProducts();
      } else {
        alert(result.error || 'Failed to save product details.');
      }
    } catch (err) {
      alert('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this product from the catalog?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': passcode,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        fetchProducts();
      } else {
        alert(result.error || 'Failed to delete product.');
      }
    } catch (err) {
      alert('A network error occurred.');
    }
  };

  // Inquiry Status & Delete handlers
  const handleUpdateInquiryStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': passcode,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, status: newStatus } : inq));
      } else {
        alert(result.error || 'Failed to update inquiry status.');
      }
    } catch (err) {
      alert('A network error occurred.');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!confirm('Are you sure you want to delete this customer inquiry from logs?')) {
      return;
    }

    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': passcode,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setInquiries(prev => prev.filter(inq => inq._id !== id));
      } else {
        alert(result.error || 'Failed to delete inquiry.');
      }
    } catch (err) {
      alert('A network error occurred.');
    }
  };

  const getWhatsAppLeadLink = (inq) => {
    let cleanPhone = inq.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }
    const text = `Hi ${inq.name}, this is Ujjwal Iron Patna. We received your website inquiry regarding:
"${inq.productNeeded || 'Steel Products'}".
We would like to share the latest wholesale rates and specifications. Let us know a convenient time to connect.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Filter Products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '' || prod.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter Inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = inq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inq.phone.includes(searchQuery) ||
                          (inq.productNeeded && inq.productNeeded.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = leadStatusFilter === '' || inq.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const categories = ['MS Pipes', 'Roofing Sheets', 'MS Angle & MS Flat', 'GP Pipes', 'Angles & Channels', 'Other'];
  const newLeadsCount = inquiries.filter(i => i.status === 'New').length;

  // 1. Password Gated Interface
  if (!isAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 shadow-xl dark:shadow-2xl backdrop-blur-md">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600/10 border border-amber-500/20 text-amber-650 dark:text-amber-500">
              <Lock size={28} />
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Admin Portal
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Enter password to manage Ujjwal Iron digital catalog.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="passcode-input" className="sr-only">
                Password
              </label>
              <input
                id="passcode-input"
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Enter Admin Password"
              />
            </div>

            {authError && (
              <p className="text-center text-xs font-semibold text-rose-500 dark:text-rose-450">
                {authError}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-500 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. Authenticated CRUD Dashboard
  return (
    <div className="min-h-screen py-16 sm:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-slate-900 pb-8 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Ujjwal Iron Dashboard</h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Manage catalog products and view wholesale leads</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {activeTab === 'products' && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-500 transition-all duration-200"
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            )}

            {activeTab === 'quotations' && !isQuotationFormOpen && (
              <button
                onClick={openCreateQuotation}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-500 transition-all duration-200"
              >
                <Plus size={16} />
                <span>Create Quotation</span>
              </button>
            )}
            
            <button
              onClick={() => {
                if (activeTab === 'products') fetchProducts();
                else if (activeTab === 'inquiries') fetchInquiries();
                else if (activeTab === 'gst') { fetchGstBills(); fetchNotifications(); }
                else if (activeTab === 'quotations') fetchQuotations();
              }}
              disabled={actionLoading}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              title="Refresh Current List"
            >
              <RefreshCw size={16} className={actionLoading ? 'animate-spin' : ''} />
            </button>

            <Link
              href="/ca-portal"
              className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-600/10 hover:bg-amber-500 transition-colors"
            >
              Go to CA Portal
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-5 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-900 pb-2 mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
            className={`pb-2.5 text-sm font-bold tracking-wide border-b-2 transition-all duration-205 shrink-0 ${
              activeTab === 'products'
                ? 'border-amber-600 text-amber-600 dark:border-amber-500 dark:text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Products Catalog ({products.length})
          </button>
          
          <button
            onClick={() => { setActiveTab('inquiries'); setSearchQuery(''); }}
            className={`pb-2.5 text-sm font-bold tracking-wide border-b-2 transition-all duration-205 shrink-0 flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'border-amber-600 text-amber-600 dark:border-amber-500 dark:text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>Customer Inquiries</span>
            {newLeadsCount > 0 ? (
              <span className="rounded-full bg-rose-600 px-2 py-0.5 text-2xs font-extrabold text-white animate-pulse">
                {newLeadsCount} NEW
              </span>
            ) : (
              <span className="rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 text-2xs font-semibold text-slate-500 dark:text-slate-400">
                {inquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('gst'); setSearchQuery(''); fetchGstBills(); fetchNotifications(); }}
            className={`pb-2.5 text-sm font-bold tracking-wide border-b-2 transition-all duration-205 shrink-0 flex items-center gap-2 ${
              activeTab === 'gst'
                ? 'border-amber-600 text-amber-600 dark:border-amber-500 dark:text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>GST Audit & Notifications</span>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="rounded-full bg-amber-600 px-2 py-0.5 text-2xs font-extrabold text-white animate-pulse">
                {notifications.filter(n => !n.read).length} NEW
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('quotations'); setQuotationSearchQuery(''); fetchQuotations(); }}
            className={`pb-2.5 text-sm font-bold tracking-wide border-b-2 transition-all duration-205 shrink-0 flex items-center gap-2 ${
              activeTab === 'quotations'
                ? 'border-amber-600 text-amber-600 dark:border-amber-500 dark:text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>Quotations ({quotations.length})</span>
          </button>
        </div>

        {/* Tab 1: Products Catalog Panel */}
        {activeTab === 'products' && (
          <div>
            {/* Filters Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-8">
              <div className="sm:col-span-8 relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search product name or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-600 dark:text-slate-350 focus:border-amber-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table of Products */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/20 shadow-lg dark:shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Product Details</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price Est.</th>
                      <th className="px-6 py-4">Visibility</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                          No products found. Add items to catalog.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => (
                        <tr key={prod._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="px-6 py-4 font-medium">
                            <div className="flex flex-col">
                              <span className="text-slate-900 dark:text-white font-bold">{prod.name}</span>
                              <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                <Shield size={10} /> Brand: {prod.brand}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                              <Tag size={10} /> {prod.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-amber-600 dark:text-amber-400 font-bold">
                            {prod.price}
                          </td>
                          <td className="px-6 py-4">
                            {prod.isActive ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                                <Eye size={12} /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 dark:bg-rose-950/60 px-2 py-1 text-xs font-bold text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                                <EyeOff size={12} /> Hidden
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(prod)}
                                className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Edit details"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod._id)}
                                className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Customer Inquiries Panel */}
        {activeTab === 'inquiries' && (
          <div>
            {/* Filter and controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-8">
              <div className="sm:col-span-8 relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer name, phone, or requirements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-4">
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-600 dark:text-slate-350 focus:border-amber-500 focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="New">New leads</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/20 shadow-lg dark:shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Customer Details</th>
                      <th className="px-6 py-4">Products Needed</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date Submitted</th>
                      <th className="px-6 py-4 text-right">Inquiry Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                          <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                          No customer inquiries found.
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((inq) => (
                        <tr key={inq._id} className={`hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors ${inq.status === 'New' ? 'bg-amber-50/20 dark:bg-amber-950/5' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                                {inq.name}
                                {inq.status === 'New' && (
                                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block"></span>
                                )}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-300 mt-1 flex items-center gap-1">
                                <Phone size={10} className="text-amber-600 dark:text-amber-500" />
                                <a href={`tel:${inq.phone}`} className="hover:underline hover:text-amber-500 dark:hover:text-amber-400">
                                  {inq.phone}
                                </a>
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <div className="flex flex-col">
                              <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">{inq.productNeeded || 'General Rates Inquiry'}</span>
                              {inq.message && (
                                <span className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2" title={inq.message}>
                                  {inq.message}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                              className={`rounded-lg border px-2.5 py-1 text-xs font-bold focus:outline-none bg-white dark:bg-slate-950 ${
                                inq.status === 'New'
                                  ? 'border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                                  : inq.status === 'Contacted'
                                  ? 'border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                                  : 'border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-500">
                            {new Date(inq.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              {/* Direct Call Icon */}
                              <a
                                href={`tel:${inq.phone}`}
                                className="p-2 text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Call customer"
                              >
                                <Phone size={16} />
                              </a>
                              {/* Direct WhatsApp Response Icon */}
                              <a
                                href={getWhatsAppLeadLink(inq)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Respond on WhatsApp"
                              >
                                <MessageSquare size={16} />
                              </a>
                              {/* Delete Lead Log */}
                              <button
                                onClick={() => handleDeleteInquiry(inq._id)}
                                className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Delete inquiry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: GST Bills & Notifications Panel */}
        {activeTab === 'gst' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Notifications Feed Column */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* SMTP Diagnostic Utility Card */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">SMTP Mail Diagnostics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Verify SMTP connections and send a real test mail to confirm configuration is correct in production.</p>
                
                {smtpTestResult && (
                  <div className={`rounded-xl p-3.5 text-xs font-semibold mb-4 border ${
                    smtpTestResult.success 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250/50 text-emerald-700 dark:text-emerald-400' 
                      : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-400'
                  }`}>
                    {smtpTestResult.success ? smtpTestResult.message : smtpTestResult.error}
                  </div>
                )}

                <button
                  onClick={handleTestSmtp}
                  disabled={smtpTestLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-amber-500 disabled:opacity-50 transition-all duration-300"
                >
                  {smtpTestLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Verifying SMTP Mail Server Connection...</span>
                    </>
                  ) : (
                    <span>Test Mail Server Delivery</span>
                  )}
                </button>
              </div>

              {/* Live Notifications Feed */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Notifications Feed</h3>
                  <button
                    onClick={clearNotifications}
                    className="text-xs text-amber-600 dark:text-amber-500 hover:underline font-bold"
                  >
                    Mark All Read
                  </button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">No notifications logged yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`rounded-2xl border p-4 text-xs leading-relaxed transition-colors ${
                          n.read
                            ? 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800 text-slate-500'
                            : 'bg-amber-50/30 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-900/50 text-slate-800 dark:text-stone-300 font-medium'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`px-2 py-0.5 rounded text-2xs uppercase font-extrabold ${
                            n.type === 'ca_login' 
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                              : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {n.type === 'ca_login' ? 'CA Logged In' : 'PDF Download'}
                          </span>
                          <span className="text-2xs text-slate-400">{new Date(n.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p>{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* GST Bills history & search column */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">GST Billing History</h3>
                
                {/* Search input query */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by customer name or bill number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {gstBills.filter(
                    (b) =>
                      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      b.billNo.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">No matching bills found.</p>
                  ) : (
                    gstBills
                      .filter(
                        (b) =>
                          b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.billNo.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((bill) => (
                        <div
                          key={bill._id}
                          className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/30 dark:bg-slate-950/20 text-sm space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">Bill #{bill.billNo}</h4>
                              <p className="text-xs text-slate-500">Date: {new Date(bill.billDate).toLocaleDateString()}</p>
                            </div>
                            <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                              ₹{bill.totalAmount.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="text-xs text-slate-605 dark:text-slate-400 space-y-0.5">
                            <div>Billed To: <span className="font-bold text-slate-800 dark:text-white">{bill.customerName}</span></div>
                            <div>GSTIN: <span className="font-mono font-semibold">{bill.gstNo}</span></div>
                          </div>

                          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex flex-wrap gap-2 text-2xs">
                            {bill.items.map((item, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded"
                              >
                                {item.name} ({item.qty}x)
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Quotations Panel */}
        {activeTab === 'quotations' && (
          <div>
            {!isQuotationFormOpen ? (
              /* --- LIST OF SAVED QUOTATIONS --- */
              <div>
                {/* Search / Filter */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-8">
                  <div className="sm:col-span-12 relative">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search quotation number or customer name..."
                      value={quotationSearchQuery}
                      onChange={(e) => setQuotationSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Table of Quotations */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/20 shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                      <thead className="bg-slate-50 dark:bg-slate-900/60 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-6 py-4">Quote No</th>
                          <th className="px-6 py-4">Customer Details</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Validity</th>
                          <th className="px-6 py-4">Total Amount</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                        {quotations.filter(q => 
                          q.quotationNo.toLowerCase().includes(quotationSearchQuery.toLowerCase()) ||
                          q.customerName.toLowerCase().includes(quotationSearchQuery.toLowerCase())
                        ).length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-slate-450 dark:text-slate-500">
                              No quotations found. Click &quot;+ Create Quotation&quot; above to start.
                            </td>
                          </tr>
                        ) : (
                          quotations.filter(q => 
                            q.quotationNo.toLowerCase().includes(quotationSearchQuery.toLowerCase()) ||
                            q.customerName.toLowerCase().includes(quotationSearchQuery.toLowerCase())
                          ).map((quote) => (
                            <tr key={quote._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                {quote.quotationNo}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-850 dark:text-stone-300">{quote.customerName}</span>
                                  <span className="text-xs text-slate-500 mt-0.5">Ph: {quote.phone}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs">
                                {new Date(quote.date).toLocaleDateString('en-IN')}
                              </td>
                              <td className="px-6 py-4 text-xs font-semibold">
                                {quote.validityDays} Days
                              </td>
                              <td className="px-6 py-4 font-mono font-black text-amber-600 dark:text-amber-400">
                                ₹{quote.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    onClick={() => handleDownloadQuotationPdf(quote)}
                                    className="p-2 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 rounded-lg hover:bg-slate-105 dark:hover:bg-slate-800 transition-colors"
                                    title="Download PDF Quotation"
                                  >
                                    <Download size={16} />
                                  </button>
                                  <button
                                    onClick={() => openEditQuotation(quote)}
                                    className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-105 dark:hover:bg-slate-800 transition-colors"
                                    title="Edit Quotation"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteQuotation(quote._id)}
                                    className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-slate-105 dark:hover:bg-slate-800 transition-colors"
                                    title="Delete Quotation"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : isQuotationPreview ? (
              /* --- QUOTATION PREVIEW MODE --- */
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-xl text-slate-900 dark:text-white">
                <div className="flex flex-wrap gap-3 justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsQuotationPreview(false)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Edit size={14} />
                      <span>Edit (वापस एडिट करें)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadQuotationPdf(quotationFormData)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Download size={14} />
                      <span>Download PDF (डाउनलोड करें)</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsQuotationFormOpen(false)}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-850 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuotationFormSubmit({ preventDefault: () => {} })}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-500 disabled:opacity-50"
                    >
                      <Save size={14} />
                      <span>{loading ? 'Saving...' : 'Save & Close'}</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document A4 Canvas Preview */}
                <div className="mx-auto max-w-3xl bg-white text-slate-900 p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-inner font-sans">
                  
                  {/* Letterhead Header */}
                  <div className="flex justify-between items-start pb-6 border-b border-slate-200">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-900">UJJWAL IRON</h2>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Dealers in MS Pipes, MS Angles, MS Flats, GP Pipes & Roofing Sheets</p>
                      <p className="text-[10px] text-slate-600 mt-2">Lalmati Devi House, Ashiyana Digha Road, Digha Ghat, Patna - 800011</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">Mobile: +91 8986043632 | Email: sales@ujjwaliron.com</p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/logo.jpg" alt="Logo" className="h-14 w-14 rounded-full border border-slate-200 object-cover" />
                  </div>

                  {/* Document Title */}
                  <div className="text-center my-6">
                    <h3 className="text-lg font-black text-amber-600 tracking-widest uppercase">QUOTATION</h3>
                  </div>

                  {/* Customer and Quote Details Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-b border-slate-100 py-4 my-4 text-[10px] text-slate-600 leading-relaxed">
                    <div>
                      <span className="font-extrabold text-slate-900 block uppercase mb-1">Quotation To:</span>
                      <p className="text-xs font-black text-slate-900">{quotationFormData.customerName}</p>
                      <p>Phone: +91 {quotationFormData.phone}</p>
                      {quotationFormData.address && <p>Delivery: {quotationFormData.address}</p>}
                      {quotationFormData.gstNo && <p>GSTIN: {quotationFormData.gstNo.toUpperCase()}</p>}
                    </div>
                    <div className="md:text-right">
                      <span className="font-extrabold text-slate-900 block uppercase mb-1">Quotation Details:</span>
                      <p>Quotation No: <span className="font-mono font-bold text-slate-900">{quotationFormData.quotationNo}</span></p>
                      <p>Date: {new Date(quotationFormData.date || new Date()).toLocaleDateString('en-IN')}</p>
                      <p>Validity: {quotationFormData.validityDays} Day(s)</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="my-6 overflow-hidden border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-[10px] border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold">
                          <th className="px-4 py-2 w-12 text-center">S.No</th>
                          <th className="px-4 py-2">Material Description</th>
                          <th className="px-4 py-2 text-right w-16">Qty</th>
                          <th className="px-4 py-2 w-16">Unit</th>
                          <th className="px-4 py-2 text-right w-24">Rate (₹)</th>
                          <th className="px-4 py-2 text-right w-24">Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {quotationFormData.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-center">{idx + 1}</td>
                            <td className="px-4 py-2 font-medium">{item.name || 'Custom Item'}</td>
                            <td className="px-4 py-2 text-right font-mono">{item.qty}</td>
                            <td className="px-4 py-2">{item.unit}</td>
                            <td className="px-4 py-2 text-right font-mono">₹{Number(item.rate).toFixed(2)}</td>
                            <td className="px-4 py-2 text-right font-mono font-bold">₹{Number(item.qty * item.rate).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Calculations summary and Signatory section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-6 pt-4 border-t border-slate-200 text-[10px] text-slate-600">
                    {/* Terms */}
                    <div>
                      <span className="font-extrabold text-slate-900 block uppercase mb-1">Terms & Conditions:</span>
                      <ul className="list-none space-y-1 pl-0">
                        {quotationFormData.terms.split('\n').map((term, tIdx) => (
                          <li key={tIdx} className="leading-snug">{term}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Cost Calculations Summary */}
                    <div className="flex flex-col items-end gap-2 text-right">
                      <div className="w-full max-w-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-mono">₹{quotationFormData.subtotal.toFixed(2)}</span>
                        </div>
                        {quotationFormData.loadingCharges > 0 && (
                          <div className="flex justify-between">
                            <span>Loading Charges:</span>
                            <span className="font-mono">₹{quotationFormData.loadingCharges.toFixed(2)}</span>
                          </div>
                        )}
                        {quotationFormData.transportCharges > 0 && (
                          <div className="flex justify-between">
                            <span>Transportation:</span>
                            <span className="font-mono">₹{quotationFormData.transportCharges.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-amber-600">
                          <span>Grand Total:</span>
                          <span className="font-mono">₹{quotationFormData.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Signatory */}
                      <div className="mt-8 pt-8 text-right w-full">
                        <p className="font-extrabold text-slate-900">For UJJWAL IRON</p>
                        <p className="text-[8px] text-slate-400 mt-8">Authorized Signatory</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* --- QUOTATION BUILDER FORM --- */
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-xl">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                  {editingQuotationId ? `Edit Quotation Details (${quotationFormData.quotationNo})` : 'Build New Steel Quotation'}
                </h3>

                <form onSubmit={handleQuotationFormSubmit} className="space-y-6">
                  {/* Part 1: Customer Details */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Customer & General Info</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Customer / Business Name *</label>
                        <input
                          type="text"
                          required
                          value={quotationFormData.customerName}
                          onChange={(e) => setQuotationFormData(prev => ({ ...prev, customerName: e.target.value }))}
                          placeholder="e.g. Ramesh Construction"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number *</label>
                        <input
                          type="text"
                          required
                          value={quotationFormData.phone}
                          onChange={(e) => setQuotationFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="10 digit number..."
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Delivery / Site Address</label>
                        <input
                          type="text"
                          value={quotationFormData.address}
                          onChange={(e) => setQuotationFormData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="e.g. Saguna More Site, Danapur"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Customer GSTIN</label>
                        <input
                          type="text"
                          value={quotationFormData.gstNo}
                          onChange={(e) => setQuotationFormData(prev => ({ ...prev, gstNo: e.target.value.toUpperCase() }))}
                          placeholder="15 character code (optional)"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Validity (Days)</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={quotationFormData.validityDays}
                          onChange={(e) => setQuotationFormData(prev => ({ ...prev, validityDays: Number(e.target.value) }))}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part 2: Interactive Quotation Items Builder */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-550">Material / Steel Items List</h4>
                      <button
                        type="button"
                        onClick={addQuotationItemRow}
                        className="text-xs font-bold text-amber-600 hover:text-amber-500 flex items-center gap-1"
                      >
                        + Add Material Row
                      </button>
                    </div>

                    <div className="space-y-3">
                      {quotationFormData.items.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                        >
                          {/* Sync dropdown */}
                          <div className="w-full md:w-44 shrink-0">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Select from Catalog</label>
                            <select
                              onChange={(e) => handleProductSelect(index, e.target.value)}
                              defaultValue=""
                              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                            >
                              <option value="">-- Custom (or pick product) --</option>
                              {products.filter(p => p.isActive).map(p => (
                                <option key={p._id} value={p._id}>{p.name} ({p.brand})</option>
                              ))}
                            </select>
                          </div>

                          {/* Item Details */}
                          <div className="flex-grow">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Item Name *</label>
                            <input
                              type="text"
                              required
                              value={item.name}
                              onChange={(e) => handleQuotationItemChange(index, 'name', e.target.value)}
                                                 className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                            />
                          </div>

                          {/* Unit / Qty / Rate / Total */}
                          <div className="grid grid-cols-4 gap-2 w-full md:w-96 shrink-0">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Unit</label>
                              <select
                                value={item.unit}
                                onChange={(e) => handleQuotationItemChange(index, 'unit', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 px-2 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                              >
                                <option value="Pcs">Pcs</option>
                                <option value="Tons">Tons</option>
                                <option value="Kgs">Kgs</option>
                                <option value="Meters">Mtr</option>
                                <option value="Bundles">Bundle</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 text-right">Qty *</label>
                              <input
                                type="number"
                                required
                                min="0.001"
                                step="any"
                                value={item.qty}
                                onChange={(e) => handleQuotationItemChange(index, 'qty', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none text-right font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 text-right">Rate *</label>
                              <input
                                type="number"
                                required
                                min="0"
                                step="any"
                                value={item.rate}
                                onChange={(e) => handleQuotationItemChange(index, 'rate', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none text-right font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 text-right">Total (₹)</label>
                              <div className="w-full text-right font-mono text-xs px-2 py-2.5 font-bold text-slate-800 dark:text-slate-200 truncate">
                                ₹{(item.qty * item.rate).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                              </div>
                            </div>
                          </div>

                          {/* Delete row */}
                          <div className="flex items-center justify-end md:pt-4">
                            <button
                              type="button"
                              onClick={() => removeQuotationItemRow(index)}
                              disabled={quotationFormData.items.length === 1}
                              className="p-2 text-slate-400 hover:text-rose-500 disabled:opacity-30 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Delete Row"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                                    {/* Part 3: Financial Calculations & Logistics */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-550">Logistics & Charges</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Loading Charges (₹)</label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={quotationFormData.loadingCharges}
                          onChange={(e) => setQuotationFormData(prev => ({ ...prev, loadingCharges: Number(e.target.value) }))}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-mono text-right focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Transport Charges (₹)</label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={quotationFormData.transportCharges}
                          onChange={(e) => setQuotationFormData(prev => ({ ...prev, transportCharges: Number(e.target.value) }))}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-mono text-right focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Cost Summary Info */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                      <div className="text-sm font-semibold text-slate-550 space-y-1">
                        <div>Items Subtotal: ₹{quotationFormData.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                      </div>
                      
                      <div className="text-xl sm:text-2xl font-black text-amber-605 dark:text-amber-400">
                        <span className="text-sm text-slate-555 font-bold block sm:inline mr-2">Grand Total:</span>
                        ₹{quotationFormData.totalAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Part 4: Editable Terms & Conditions */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Terms and Conditions (नियम और शर्तें)
                    </label>
                    <textarea
                      rows="4"
                      value={quotationFormData.terms}
                      onChange={(e) => setQuotationFormData(prev => ({ ...prev, terms: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none resize-none font-sans"
                    ></textarea>
                  </div>

                  {/* Part 5: Actions */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsQuotationFormOpen(false)}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-5 py-3 text-sm font-bold text-slate-500 hover:text-slate-850 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsQuotationPreview(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 px-5 py-3 text-sm font-bold shadow-sm transition-colors"
                    >
                      <Eye size={16} />
                      <span>Preview Quotation</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-amber-500 disabled:opacity-50"
                    >
                      <Save size={16} />
                      <span>{loading ? 'Saving...' : 'Save & Close'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Modal Form for Add/Edit Products */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl my-8 text-slate-900 dark:text-slate-100">
              {/* Close Button */}
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute right-4 top-4 rounded-xl p-2 text-slate-450 hover:bg-slate-105 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                {editingId ? 'Edit Product Catalog Details' : 'Add New Catalog Product'}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="e.g. MS Pipe 3 Inch Heavy"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      required
                      value={formData.brand}
                      onChange={handleFormChange}
                      placeholder="e.g. Tata Structura"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-700 dark:text-slate-350 focus:border-amber-500 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Estimated Price (or On Request)
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      placeholder="e.g. ₹55,000/Ton or On Request"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image Upload & URL Override */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1">
                    Product Image
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                      {formData.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={formData.imageUrl}
                          alt="Product Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-3xs text-slate-400 dark:text-slate-500 font-semibold text-center px-1">No Image</div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="file"
                          id="admin-image-upload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="admin-image-upload"
                          className={`inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-500 cursor-pointer select-none transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          {uploading ? 'Uploading...' : 'Upload Image File'}
                        </label>
                        {formData.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-rose-600 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                      <p className="text-3xs text-slate-450 dark:text-slate-500">
                        Supports PNG, JPG, JPEG, WEBP. Max 5MB.
                      </p>
                    </div>
                  </div>

                  {/* Fallback Manual URL Input (for flexibility) */}
                  <div className="pt-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      Or Paste Image Link manually
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleFormChange}
                      placeholder="e.g. /images/products/angle.jpg"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Product Description
                  </label>
                  <textarea
                    name="description"
                    rows="2"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Brief summary of grade, application, or features..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none resize-none"
                  ></textarea>
                </div>

                {/* Specifications List */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Product Specifications
                    </label>
                    <button
                      type="button"
                      onClick={addSpecField}
                      className="text-xs font-bold text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400"
                    >
                      + Add Specification Row
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2">
                    {formData.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Spec Key (e.g. Thickness)"
                          value={spec.key}
                          onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-100 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Spec Value (e.g. 2.5 mm)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-855 bg-slate-100 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecField(index)}
                          className="p-2 text-slate-450 hover:text-rose-600 rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleFormChange}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-amber-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <label htmlFor="isActive" className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-350 select-none">
                    Show product in user catalog (Active)
                  </label>
                </div>

                {/* Submit Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-5 py-3 text-sm font-bold text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-amber-500 disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{loading ? 'Saving...' : 'Save Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
