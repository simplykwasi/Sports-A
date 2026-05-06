import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Real-time subscription hook for Supabase tables
 * Monitors row-level changes and updates React state instantly
 */
export function useRealtimeSubscription(tableName, options = {}) {
  const { filter = null, onInsert, onUpdate, onDelete } = options;

  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const subscribe = async () => {
      try {
        let query = supabase
          .channel(`public:${tableName}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: tableName,
              ...(filter && { filter }),
            },
            (payload) => {
              onInsert?.(payload.new);
              setData((prev) => [...prev, payload.new]);
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: tableName,
              ...(filter && { filter }),
            },
            (payload) => {
              onUpdate?.(payload.new, payload.old);
              setData((prev) =>
                prev.map((item) => (item.id === payload.new.id ? payload.new : item))
              );
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'DELETE',
              schema: 'public',
              table: tableName,
              ...(filter && { filter }),
            },
            (payload) => {
              onDelete?.(payload.old);
              setData((prev) => prev.filter((item) => item.id !== payload.old.id));
            }
          )
          .subscribe((status) => {
            setIsConnected(status === 'SUBSCRIBED');
          });

        subscriptionRef.current = query;
      } catch (err) {
        setError(err.message);
        console.error('Realtime subscription failed:', err);
      }
    };

    subscribe();

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [tableName, filter, onInsert, onUpdate, onDelete]);

  return { data, isConnected, error };
}

/**
 * Specialized hook for live match updates
 */
export function useLiveMatchUpdates(fixtureId) {
  const [liveEvents, setLiveEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!fixtureId) return;

    const subscribe = async () => {
      try {
        const query = supabase
          .channel(`live-events:${fixtureId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'live_events',
              filter: `fixture_id=eq.${fixtureId}`,
            },
            (payload) => {
              setLiveEvents((prev) => {
                const updated = [
                  ...prev.filter((e) => e.event_id !== payload.new.event_id),
                  payload.new,
                ];
                return updated.sort((a, b) => new Date(b.event_time) - new Date(a.event_time));
              });
            }
          )
          .subscribe((status) => {
            setIsConnected(status === 'SUBSCRIBED');
          });

        subscriptionRef.current = query;
      } catch (err) {
        setError(err.message);
        console.error('Live match subscription failed:', err);
      }
    };

    subscribe();

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [fixtureId]);

  return { liveEvents, isConnected, error };
}

/**
 * Specialized hook for prediction and odds updates
 */
export function usePredictionUpdates(fixtureId) {
  const [prediction, setPrediction] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!fixtureId) return;

    const subscribe = async () => {
      try {
        const query = supabase
          .channel(`predictions:${fixtureId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'predictions',
              filter: `fixture_id=eq.${fixtureId}`,
            },
            (payload) => {
              setPrediction(payload.new);
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'market_data',
              filter: `fixture_id=eq.${fixtureId}`,
            },
            (payload) => {
              setMarketData((prev) => [payload.new, ...prev]);
            }
          )
          .subscribe((status) => {
            setIsConnected(status === 'SUBSCRIBED');
          });

        subscriptionRef.current = query;
      } catch (err) {
        setError(err.message);
        console.error('Prediction updates subscription failed:', err);
      }
    };

    subscribe();

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [fixtureId]);

  return { prediction, marketData, isConnected, error };
}
