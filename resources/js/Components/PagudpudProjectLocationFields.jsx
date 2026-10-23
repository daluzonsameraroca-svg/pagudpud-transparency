export default function PagudpudProjectLocationFields({
    idPrefix,
    barangay,
    sitio,
    onChange,
    error,
    barangays,
    loading,
    barangaysError,
    retry,
}) {
    const inputClass =
        'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';
    const labelClass = 'mb-1.5 block text-xs font-medium text-slate-700';
    const barangayId = `${idPrefix}-barangay`;
    const sitioId = `${idPrefix}-sitio`;

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div>
                <label htmlFor={barangayId} className={labelClass}>
                    Barangay
                    <span className="ml-1 text-red-500">*</span>
                </label>
                <select
                    id={barangayId}
                    value={barangay}
                    onChange={(event) =>
                        onChange('barangay', event.target.value)
                    }
                    required
                    disabled={loading || Boolean(barangaysError)}
                    aria-invalid={Boolean(error || barangaysError)}
                    className={inputClass}
                >
                    <option value="">
                        {loading ? 'Loading barangays...' : 'Select barangay'}
                    </option>
                    {barangays.map((option) => (
                        <option key={option.code} value={option.name}>
                            {option.name}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1.5 text-xs text-red-600">{error}</p>
                )}
                {barangaysError && (
                    <div className="mt-1.5 text-xs text-red-600" role="alert">
                        <p>{barangaysError}</p>
                        <button
                            type="button"
                            onClick={retry}
                            className="mt-1 font-semibold underline"
                        >
                            Try again
                        </button>
                    </div>
                )}
            </div>

            <div>
                <label htmlFor={sitioId} className={labelClass}>
                    Sitio / Purok
                </label>
                <input
                    id={sitioId}
                    type="text"
                    value={sitio}
                    onChange={(event) => onChange('sitio', event.target.value)}
                    placeholder="Optional"
                    maxLength={100}
                    className={inputClass}
                />
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-lg bg-slate-50 px-3 py-2.5 text-xs sm:col-span-2 sm:grid-cols-2">
                <p>
                    <span className="block text-slate-500">Municipality</span>
                    <span className="font-medium text-slate-800">Pagudpud</span>
                </p>
                <p>
                    <span className="block text-slate-500">Province</span>
                    <span className="font-medium text-slate-800">
                        Ilocos Norte
                    </span>
                </p>
            </div>
        </div>
    );
}
