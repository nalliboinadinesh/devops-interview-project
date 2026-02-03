/**
 * React Query Hooks for Unified Entities
 * Simple hooks for CRUD operations on any entity
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiClient';
import { toast } from 'react-toastify';

/**
 * Hook to list all records of an entity
 */
export const useListEntity = (entity, options = {}) => {
  const { sort = '-created_date', page = 1, limit = 100, enabled = true } = options;

  return useQuery({
    queryKey: [entity, 'list', { sort, page, limit }],
    queryFn: async () => {
      const response = await api.list(entity, sort, page, limit);
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30
  });
};

/**
 * Hook to filter records of an entity
 */
export const useFilterEntity = (entity, filters = {}, options = {}) => {
  const { sort = '-created_date', page = 1, limit = 100, enabled = true } = options;

  return useQuery({
    queryKey: [entity, 'filter', { filters, sort, page, limit }],
    queryFn: async () => {
      const response = await api.filter(entity, filters, sort, page, limit);
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30
  });
};

/**
 * Hook to get single record by ID
 */
export const useGetEntity = (entity, id, options = {}) => {
  const { enabled = !!id } = options;

  return useQuery({
    queryKey: [entity, 'get', id],
    queryFn: async () => {
      const response = await api.getById(entity, id);
      return response.data.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30
  });
};

/**
 * Hook to create a record
 */
export const useCreateEntity = (entity, options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, showToast = true } = options;

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.create(entity, data);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidate list queries for this entity
      queryClient.invalidateQueries({ queryKey: [entity, 'list'] });
      queryClient.invalidateQueries({ queryKey: [entity, 'filter'] });

      if (showToast) {
        toast.success(`${entity} created successfully`);
      }

      onSuccess?.(data);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || `Failed to create ${entity}`;
      if (showToast) {
        toast.error(message);
      }
      onError?.(error);
    }
  });
};

/**
 * Hook to update a record
 */
export const useUpdateEntity = (entity, options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, showToast = true } = options;

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.update(entity, id, data);
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate list and specific record queries
      queryClient.invalidateQueries({ queryKey: [entity, 'list'] });
      queryClient.invalidateQueries({ queryKey: [entity, 'filter'] });
      queryClient.invalidateQueries({ queryKey: [entity, 'get', variables.id] });

      if (showToast) {
        toast.success(`${entity} updated successfully`);
      }

      onSuccess?.(data);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || `Failed to update ${entity}`;
      if (showToast) {
        toast.error(message);
      }
      onError?.(error);
    }
  });
};

/**
 * Hook to delete a record
 */
export const useDeleteEntity = (entity, options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, showToast = true } = options;

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(entity, id);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: [entity, 'list'] });
      queryClient.invalidateQueries({ queryKey: [entity, 'filter'] });

      if (showToast) {
        toast.success(`${entity} deleted successfully`);
      }

      onSuccess?.(data);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || `Failed to delete ${entity}`;
      if (showToast) {
        toast.error(message);
      }
      onError?.(error);
    }
  });
};

/**
 * Hook to count records
 */
export const useCountEntity = (entity, filters = {}) => {
  return useQuery({
    queryKey: [entity, 'count', filters],
    queryFn: async () => {
      const response = await api.count(entity, filters);
      return response.data.count;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30
  });
};

/**
 * Hook to upload file
 */
export const useUploadFile = (options = {}) => {
  const { onSuccess, onError, showToast = true } = options;

  return useMutation({
    mutationFn: async (file) => {
      const response = await api.uploadFile(file);
      return response.data;
    },
    onSuccess: (data) => {
      if (showToast) {
        toast.success('File uploaded successfully');
      }
      onSuccess?.(data);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Failed to upload file';
      if (showToast) {
        toast.error(message);
      }
      onError?.(error);
    }
  });
};

// Pre-configured hooks for common entities
export const useStudents = (options) => useListEntity('student', options);
export const useFilterStudents = (filters, options) => useFilterEntity('student', filters, options);
export const useGetStudent = (id, options) => useGetEntity('student', id, options);
export const useCreateStudent = (options) => useCreateEntity('student', options);
export const useUpdateStudent = (options) => useUpdateEntity('student', options);
export const useDeleteStudent = (options) => useDeleteEntity('student', options);

export const useBranches = (options) => useListEntity('branch', options);
export const useFilterBranches = (filters, options) => useFilterEntity('branch', filters, options);
export const useGetBranch = (id, options) => useGetEntity('branch', id, options);
export const useCreateBranch = (options) => useCreateEntity('branch', options);
export const useUpdateBranch = (options) => useUpdateEntity('branch', options);
export const useDeleteBranch = (options) => useDeleteEntity('branch', options);

export const useMaterials = (options) => useListEntity('material', options);
export const useFilterMaterials = (filters, options) => useFilterEntity('material', filters, options);
export const useGetMaterial = (id, options) => useGetEntity('material', id, options);
export const useCreateMaterial = (options) => useCreateEntity('material', options);
export const useUpdateMaterial = (options) => useUpdateEntity('material', options);
export const useDeleteMaterial = (options) => useDeleteEntity('material', options);

export const useQuestionPapers = (options) => useListEntity('question-paper', options);
export const useFilterQuestionPapers = (filters, options) => useFilterEntity('question-paper', filters, options);
export const useGetQuestionPaper = (id, options) => useGetEntity('question-paper', id, options);
export const useCreateQuestionPaper = (options) => useCreateEntity('question-paper', options);
export const useUpdateQuestionPaper = (options) => useUpdateEntity('question-paper', options);
export const useDeleteQuestionPaper = (options) => useDeleteEntity('question-paper', options);

export const useAnnouncements = (options) => useListEntity('announcement', options);
export const useFilterAnnouncements = (filters, options) => useFilterEntity('announcement', filters, options);
export const useGetAnnouncement = (id, options) => useGetEntity('announcement', id, options);
export const useCreateAnnouncement = (options) => useCreateEntity('announcement', options);
export const useUpdateAnnouncement = (options) => useUpdateEntity('announcement', options);
export const useDeleteAnnouncement = (options) => useDeleteEntity('announcement', options);

export const useCarouselImages = (options) => useListEntity('carousel', options);
export const useFilterCarouselImages = (filters, options) => useFilterEntity('carousel', filters, options);
export const useGetCarouselImage = (id, options) => useGetEntity('carousel', id, options);
export const useCreateCarouselImage = (options) => useCreateEntity('carousel', options);
export const useUpdateCarouselImage = (options) => useUpdateEntity('carousel', options);
export const useDeleteCarouselImage = (options) => useDeleteEntity('carousel', options);
