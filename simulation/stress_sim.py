import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

np.random.seed(42)

k = 8.617e-5  # Boltzmann constant (eV/K)
Ea = 0.7      # Activation energy (eV)
T_use = 298.0
T_test = 358.0
AF = np.exp((Ea / k) * (1 / T_use - 1 / T_test))

years = np.arange(1, 101)

shape_param = 1.5
scale_param_10yr = 15.0
scale_param_100yr = 80.0

mtbf_10yr = scale_param_10yr * (years ** (1 / shape_param))
mtbf_100yr = scale_param_100yr * (years ** (1 / shape_param))

mttc = 5 + 0.5 * np.log1p(years) + 0.2 * np.sin(0.3 * years)

magnetic_drift = 1.0 + 0.05 * np.sqrt(years) + 0.02 * np.random.randn(len(years))
biometric_drift = 1.0 + 0.03 * np.sqrt(years) + 0.01 * np.random.randn(len(years))

performance = np.ones_like(years, dtype=float)
for i in range(4):
    start = i * 25
    end = min((i + 1) * 25, len(years))
    decay = np.linspace(1.0, 0.85, end - start)
    performance[start:end] = decay
performance += 0.05 * np.random.randn(len(years))

df = pd.DataFrame({
    'year': years,
    'AF': AF,
    'mtbf_10yr': mtbf_10yr,
    'mtbf_100yr': mtbf_100yr,
    'mttc': mttc,
    'magnetic_drift': magnetic_drift,
    'biometric_drift': biometric_drift,
    'performance': performance
})

if __name__ == '__main__':
    plt.style.use('seaborn-v0_8-darkgrid')
    fig, axs = plt.subplots(3, 2, figsize=(14, 12))

    axs[0, 0].plot(years, mtbf_10yr, label='10-Year Projection', color='blue')
    axs[0, 0].plot(years, mtbf_100yr, label='100-Year Projection', color='green')
    axs[0, 0].set_title('MTBF')
    axs[0, 0].set_xlabel('Years')

    axs[0, 1].plot(years, mttc, color='red')
    axs[0, 1].set_title('MTTC')
    axs[0, 1].set_xlabel('Years')

    axs[1, 0].plot(years, magnetic_drift, color='purple')
    axs[1, 0].set_title('Magnetic Drift')
    axs[1, 0].set_xlabel('Years')

    axs[1, 1].plot(years, biometric_drift, color='orange')
    axs[1, 1].set_title('Biometric Drift')
    axs[1, 1].set_xlabel('Years')

    axs[2, 0].plot(years, performance, color='teal')
    axs[2, 0].set_title('Performance with Refresh')
    axs[2, 0].set_xlabel('Years')

    axs[2, 1].axis('off')

    plt.tight_layout()
    plt.show()
    print('Simulation complete.')
