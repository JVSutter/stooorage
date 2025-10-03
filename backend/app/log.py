import logging


def get_logger():
    global __logger
    if '__logger' not in globals():
        logging.basicConfig(
            level=logging.INFO,
            format='[%(levelname)s - %(filename)s:%(lineno)d:%(funcName)s()] %(message)s'
        )
        __logger = logging.getLogger(__name__)

    return __logger
