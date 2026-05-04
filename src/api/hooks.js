import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import api from "./index";
import { subscribe, getState } from "./liveSync";

// Re-render when live data is synced from the real StackRox API
export function useLiveSync() {
  return useSyncExternalStore(
    subscribe,
    getState,
    getState
  );
}

export function useApiStatus() {
  const [status, setStatus] = useState({
    useReal: false,
    status: "disconnected",
    message: "",
  });

  useEffect(() => {
    setStatus({
      useReal: api.useReal,
      status: api.connectionStatus,
      message: api.statusMessage,
    });
    const unsubscribe = api.onStatusChange(setStatus);
    return unsubscribe;
  }, []);

  return status;
}

export function useApiData(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => { refetch(); }, deps);

  return { data, loading, error, refetch };
}

export function useDeployments(params = {}) {
  const fetchFn = useCallback(() => api.listDeployments(params), [JSON.stringify(params)]);
  return useApiData(fetchFn, [JSON.stringify(params)]);
}

export function useClusters() {
  const fetchFn = useCallback(() => api.listClusters(), []);
  return useApiData(fetchFn, []);
}

export function useNamespaces(clusterId = null) {
  const fetchFn = useCallback(() => api.listNamespaces(clusterId), [clusterId]);
  return useApiData(fetchFn, [clusterId]);
}

export function useVulnerabilitySummary() {
  const fetchFn = useCallback(() => api.getVulnerabilitySummary(), []);
  return useApiData(fetchFn, []);
}

export function useWorkloadCVEs(filters = {}) {
  const fetchFn = useCallback(() => api.getWorkloadCVEs(filters), [JSON.stringify(filters)]);
  return useApiData(fetchFn, [JSON.stringify(filters)]);
}

export function useSavedFilters() {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.listSavedFilters();
      setFilters(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const createFilter = useCallback(async (filter) => {
    const newFilter = await api.createSavedFilter(filter);
    setFilters((prev) => [...prev, newFilter]);
    return newFilter;
  }, []);

  const updateFilter = useCallback(async (id, updates) => {
    const updated = await api.updateSavedFilter(id, updates);
    setFilters((prev) => prev.map((f) => (f.id === id ? updated : f)));
    return updated;
  }, []);

  const deleteFilter = useCallback(async (id) => {
    await api.deleteSavedFilter(id);
    setFilters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return { filters, loading, error, refetch, createFilter, updateFilter, deleteFilter };
}

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.listReports();
      setReports(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const createReport = useCallback(async (config) => {
    setGenerating(true);
    try {
      const newReport = await api.createReport(config);
      setReports((prev) => [newReport, ...prev]);
      return newReport;
    } finally {
      setGenerating(false);
    }
  }, []);

  return { reports, loading, error, generating, refetch, createReport };
}

export function useMetadata() {
  const fetchFn = useCallback(() => api.getMetadata(), []);
  return useApiData(fetchFn, []);
}

export function useAlerts(params = {}) {
  const fetchFn = useCallback(() => api.listAlerts(params), [JSON.stringify(params)]);
  return useApiData(fetchFn, [JSON.stringify(params)]);
}

export function usePolicies() {
  const fetchFn = useCallback(() => api.listPolicies(), []);
  return useApiData(fetchFn, []);
}

export function useVulnerabilityExceptions(params = {}) {
  const fetchFn = useCallback(() => api.listVulnerabilityExceptions(params), [JSON.stringify(params)]);
  return useApiData(fetchFn, [JSON.stringify(params)]);
}

export function useReportConfigurations(params = {}) {
  const fetchFn = useCallback(() => api.listReportConfigurations(params), [JSON.stringify(params)]);
  return useApiData(fetchFn, [JSON.stringify(params)]);
}

export function useSummaryCounts() {
  const fetchFn = useCallback(() => api.getSummaryCounts(), []);
  return useApiData(fetchFn, []);
}
