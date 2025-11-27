import pickle
import sys

with open("E:/Documentos/UANL/7/Intro Aprendizaje Automatico/PIA/MovieForMe/test/FinalMoviesFiltered_V3.pk1", "rb") as f:
    df = pickle.load(f)

print(sys.getsizeof(df))