import { router, useForm } from '@inertiajs/react';
import { Download, FileText, Loader2, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User, UserDocument } from '@/types';

interface UserDocumentsProps {
    user: User;
}

export function UserDocuments({ user }: UserDocumentsProps) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] =
        useState<UserDocument | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadForm = useForm<{ documents: File[]; category: string }>({
        documents: [],
        category: '',
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            uploadForm.setData('documents', Array.from(e.target.files));
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (uploadForm.data.documents.length === 0) return;

        uploadForm.post(UserController.storeDocument({ user: user.id }).url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                uploadForm.reset();
                if (fileInputRef.current) fileInputRef.current.value = '';
                setIsUploadModalOpen(false);
            },
        });
    };

    const confirmDeleteDocument = () => {
        if (!documentToDelete) return;
        router.delete(
            UserController.destroyDocument({
                user: user.id,
                document: documentToDelete.id,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => setDocumentToDelete(null),
            },
        );
    };

    const documents = user.documents ?? [];

    return (
        <>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6">
                    <div className="mb-4 flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center sm:gap-0">
                        <h3 className="text-lg font-semibold">
                            Supporting documents
                        </h3>
                        <Button
                            onClick={() => setIsUploadModalOpen(true)}
                            size="sm"
                            className="h-9"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                        </Button>
                    </div>

                    {documents.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                            {documents.map((doc) => {
                                const isImage =
                                    doc.mime_type?.startsWith('image/') ||
                                    /\.(jpg|jpeg|png|gif|webp)$/i.test(
                                        doc.original_name,
                                    );

                                return (
                                    <div
                                        key={doc.id}
                                        className="group relative flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:shadow-md"
                                    >
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full border-b bg-muted/50"
                                        >
                                            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-muted">
                                                {isImage ? (
                                                    <img
                                                        src={
                                                            doc.thumbnail_url ||
                                                            doc.url
                                                        }
                                                        alt={doc.original_name}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <FileText className="h-10 w-10 text-muted-foreground/60 transition-colors group-hover:text-muted-foreground" />
                                                )}
                                            </div>
                                        </a>
                                        <div className="flex flex-1 flex-col justify-between gap-3 p-3">
                                            <div>
                                                <p
                                                    className="line-clamp-1 text-sm font-medium"
                                                    title={doc.original_name}
                                                >
                                                    {doc.original_name}
                                                </p>
                                                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                                    <span>
                                                        {doc.formatted_size}
                                                    </span>
                                                    {doc.category && (
                                                        <>
                                                            <span>•</span>
                                                            <Badge
                                                                variant="secondary"
                                                                className="px-1.5 py-0 text-[10px] font-semibold uppercase"
                                                            >
                                                                {doc.category}
                                                            </Badge>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-auto flex justify-end gap-1 border-t pt-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary"
                                                    asChild
                                                    title="Download document"
                                                >
                                                    <a
                                                        href={doc.url}
                                                        download={
                                                            doc.original_name
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() =>
                                                        setDocumentToDelete(doc)
                                                    }
                                                    title="Delete document"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-muted-foreground">
                            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <p className="text-sm font-medium">
                                No documents yet.
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Uploaded documents will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog
                open={!!documentToDelete}
                onOpenChange={(open) => !open && setDocumentToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete document</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{documentToDelete?.original_name}</strong>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteDocument}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog
                open={isUploadModalOpen}
                onOpenChange={(open) => {
                    setIsUploadModalOpen(open);
                    if (!open) {
                        uploadForm.reset();
                        if (fileInputRef.current)
                            fileInputRef.current.value = '';
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Upload document</DialogTitle>
                        <DialogDescription>
                            Pick a file and optionally categorize it.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="documents">File</Label>
                            <Input
                                ref={fileInputRef}
                                id="documents"
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                            />
                            {uploadForm.errors.documents && (
                                <p className="text-sm text-destructive">
                                    {uploadForm.errors.documents}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                placeholder="e.g. KTP, Ijazah"
                                value={uploadForm.data.category}
                                onChange={(e) =>
                                    uploadForm.setData(
                                        'category',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsUploadModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    uploadForm.processing ||
                                    uploadForm.data.documents.length === 0
                                }
                            >
                                {uploadForm.processing && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Upload
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
